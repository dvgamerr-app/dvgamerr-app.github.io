<script lang="ts">
	import { untrack } from "svelte";
	import type { Attachment } from "svelte/attachments";
	import {
		Camera,
		Mesh,
		Program,
		Renderer,
		Texture,
		Transform,
		Triangle,
		Vec2,
		Vec3,
	} from "ogl";
	import { gsap } from "gsap";
	import type { Snippet } from "svelte";
	// Astro turns bare image imports into ImageMetadata objects; `?url` keeps a plain string.
	import landTextureUrl from "../assets/land-texture.png?url";
	import { type ColorRepresentation, toLinearRgb, toRgb } from "../helpers/color";
	import type { GlobeAsciiPalette, GlobeFrame, GlobeLight, GlobeMarker, GlobeMarkerTooltipContext } from "./types";
	import GlobeMarkerItem from "./GlobeMarkerItem.svelte";

	interface FresnelConfig {
		/**
		 * Base body color for the globe surface.
		 * @default "#111113"
		 */
		color?: ColorRepresentation;
		/**
		 * Accent color applied by the Fresnel rim.
		 * @default "#FF6900"
		 */
		rimColor?: ColorRepresentation;
		/**
		 * Controls how tight the Fresnel rim hug is.
		 * Higher values yield a thinner outline.
		 * @default 6
		 */
		rimPower?: number;
		/**
		 * Intensity multiplier for the Fresnel rim color.
		 * @default 1.5
		 */
		rimIntensity?: number;
	}

	interface AtmosphereConfig {
		/**
		 * Color of the atmosphere glow.
		 * @default "#FF6900"
		 */
		color?: ColorRepresentation;
		/**
		 * Size of the atmosphere relative to the globe radius.
		 * @default 1.1
		 */
		scale?: number;
		/**
		 * Falloff power of the glow. Higher values mean a sharper edge.
		 * @default 12.0
		 */
		power?: number;
		/**
		 * Base coefficient for the intensity calculation.
		 * Controls how far the glow extends inwards.
		 * @default 0.9
		 */
		coefficient?: number;
		/**
		 * Global intensity multiplier.
		 * @default 2.0
		 */
		intensity?: number;
	}

	interface Props {
		/**
		 * Scale multiplier for the globe field.
		 * @default 1
		 */
		scale?: number;
		/**
		 * Horizontal globe offset in normalized viewport units.
		 * @default 0
		 */
		offsetX?: number;
		/**
		 * Vertical globe offset in normalized viewport units.
		 * @default 0
		 */
		offsetY?: number;
		/**
		 * Optional overrides for the Fresnel shader uniforms.
		 */
		fresnelConfig?: FresnelConfig;
		/**
		 * Optional configuration for the atmospheric halo.
		 */
		atmosphereConfig?: AtmosphereConfig;
		/**
		 * Local patch: width in CSS pixels of one ASCII cell; the height follows the glyph aspect.
		 * @default 14
		 */
		cellSize?: number;
		/**
		 * Local patch: colors of the ASCII land, tiles and grid.
		 */
		ascii?: GlobeAsciiPalette;
		/**
		 * Local patch: re-roll glyphs over time; turn off for reduced motion.
		 * @default true
		 */
		shimmer?: boolean;
		/**
		 * Whether the globe should auto-rotate.
		 * @default true
		 */
		autoRotate?: boolean;
		/**
		 * Whether to lock the camera's polar angle.
		 * @default true
		 */
		lockedPolarAngle?: boolean;
		/**
		 * Markers to display on the globe.
		 */
		markers?: GlobeMarker[];
		/**
		 * Optional custom tooltip renderer for markers.
		 */
		markerTooltip?: Snippet<[GlobeMarkerTooltipContext]>;
		/**
		 * Coordinates [lat, lon] to focus on.
		 */
		focusOn?: [number, number] | null;
		/**
		 * Extra longitude rotation in radians applied on top of the camera
		 * (e.g. driven by scroll progress).
		 * @default 0
		 */
		rotationOffset?: number;
		/**
		 * Local patch: screen-space direction (x right, y up) of the scene light.
		 * The rim and atmosphere brighten toward it. Mutate the same object to
		 * animate it without re-rendering; null keeps the uniform rim.
		 */
		lightDirection?: GlobeLight | null;
		/**
		 * Local patch: called every frame after the camera update with a
		 * projection helper, so overlays (e.g. orbiting satellites) stay in sync.
		 */
		onFrame?: (frame: GlobeFrame) => void;
	}

	interface ProjectedMarker {
		marker: GlobeMarker;
		index: number;
		screenX: number;
		screenY: number;
		visibility: number;
	}

	interface UniformUpdaterState {
		scale: number;
		offsetX: number;
		offsetY: number;
		cellSize: number;
		ascii: GlobeAsciiPalette;
		shimmer: boolean;
		fresnelConfig: Required<FresnelConfig>;
		atmosphereConfig: Required<AtmosphereConfig>;
	}

	const PI = Math.PI;
	const DEG2RAD = PI / 180;
	const EPSILON = 1e-6;
	const COBE_GLOBE_RADIUS = 0.8;
	const DEFAULT_GLOBE_SCALE = 1;
	const AUTO_ROTATE_SPEED = (2 * PI) / 30;
	const ROTATE_SENSITIVITY = 0.005;
	const SMOOTHING_STRENGTH = 14;
	const LOCKED_POLAR_ANGLE = 1.5;
	const LOCKED_THETA = Math.asin(Math.cos(LOCKED_POLAR_ANGLE));
	const MIN_THETA = -PI * 0.5 + 0.001;
	const MAX_THETA = PI * 0.5 - 0.001;
	const VISIBILITY_MIN_DOT = 0.24;
	const VISIBILITY_MAX_DOT = 0.48;
	// Local patch: glyph atlas. The shader indexes it by range: 0-6 light, 7-10 sea waves (with 3-4 as calm sea),
	// 11-12 medium land, 13-18 heavy land (16-18 also fill inverted cells, 18 marks markers).
	const GLYPHS = "'`,.:;!-~=+otS%X8#@";
	// Cell height over width, close to a monospace character box.
	const CELL_ASPECT = 10 / 7;
	const defaultAsciiPalette: GlobeAsciiPalette = {
		paper: "#060a14",
		ink: "#a3d5cf",
		inkAlt: "#b6b1e6",
		sea: "#6c8bab",
		invert: "#c5ced6",
		accent: ["#e98fb5", "#e8df74"],
	};
	const MAX_SHADER_MARKERS = 128;
	const SHADER_MARKER_SIZE_SCALE = 0.5;
	const MIN_SHADER_MARKER_SIZE = 0.003;
	const MAX_SHADER_MARKER_SIZE = 0.06;

	const defaultFresnelConfig: Required<FresnelConfig> = {
		color: "#17181A",
		rimColor: "#FF6900",
		rimPower: 6,
		rimIntensity: 1.5,
	};

	const defaultAtmosphereConfig: Required<AtmosphereConfig> = {
		color: "#FF6900",
		scale: 1.1,
		power: 12.0,
		coefficient: 0.9,
		intensity: 1.1,
	};

	let {
		scale = 1,
		offsetX = 0,
		offsetY = 0,
		fresnelConfig = {},
		atmosphereConfig = {},
		cellSize = 14,
		ascii = defaultAsciiPalette,
		shimmer = true,
		autoRotate = true,
		lockedPolarAngle = true,
		markers = [],
		markerTooltip,
		focusOn = null,
		rotationOffset = 0,
		lightDirection = null,
		onFrame,
	}: Props = $props();

	let projectedMarkers = $state<ProjectedMarker[]>([]);

	const resolvedFresnelConfig = $derived({
		...defaultFresnelConfig,
		...fresnelConfig,
	});
	const resolvedAtmosphereConfig = $derived({
		...defaultAtmosphereConfig,
		...atmosphereConfig,
	});

	let updateUniforms = $state<((state: UniformUpdaterState) => void) | null>(
		null,
	);
	let syncFocusTarget = $state<
		((target: [number, number] | null) => void) | null
	>(null);
	let focusTween: gsap.core.Tween | null = null;

	const clamp = (value: number, min: number, max: number) =>
		Math.min(max, Math.max(min, value));

	const clampTheta = (value: number, lockPolar: boolean) =>
		lockPolar ? LOCKED_THETA : clamp(value, MIN_THETA, MAX_THETA);

	const smoothstep = (value: number, edge0: number, edge1: number) => {
		if (Math.abs(edge1 - edge0) <= EPSILON) {
			return value >= edge1 ? 1 : 0;
		}
		const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
		return t * t * (3 - 2 * t);
	};

	// One glyph per cell-sized slot, drawn at the exact framebuffer size and centered on the tile,
	// which leaves a `gap` on the left and bottom of each cell.
	const makeGlyphAtlas = ({ width, height, gap }: { width: number; height: number; gap: number }) => {
		const canvas = document.createElement("canvas");
		canvas.width = width * GLYPHS.length;
		canvas.height = height;
		const ctx = canvas.getContext("2d")!;
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#fff";
		ctx.font = `500 ${Math.round(height * 0.72)}px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		[...GLYPHS].forEach((glyph, index) => {
			ctx.fillText(glyph, index * width + (width + gap) / 2, (height - gap) / 2 + height * 0.04);
		});
		return canvas;
	};

	function normalizeAngle(value: number): number {
		const wrapped = (((value + PI) % (2 * PI)) + 2 * PI) % (2 * PI);
		return wrapped - PI;
	}

	function shortestAngleTarget(current: number, next: number): number {
		const delta = normalizeAngle(next - current);
		return current + delta;
	}

	function lonLatToCartesian(lon: number, lat: number, r: number) {
		const lonRad = lon * DEG2RAD;
		const latRad = lat * DEG2RAD;

		const y = r * Math.sin(latRad);
		const rXZ = r * Math.cos(latRad);
		const x = rXZ * Math.sin(lonRad);
		const z = rXZ * Math.cos(lonRad);

		return { x, y, z };
	}

	function cartesianToRotation(x: number, y: number, z: number) {
		const length = Math.hypot(x, y, z);
		if (length <= EPSILON) {
			return { phi: 0, theta: 0 };
		}
		const nx = x / length;
		const ny = y / length;
		const nz = z / length;

		return {
			phi: Math.atan2(-nx, nz),
			theta: Math.asin(clamp(ny, -1, 1)),
		};
	}

	function applyRotation(
		x: number,
		y: number,
		z: number,
		phi: number,
		theta: number,
	) {
		const cx = Math.cos(theta);
		const cy = Math.cos(phi);
		const sx = Math.sin(theta);
		const sy = Math.sin(phi);

		return {
			rx: cy * x + sy * z,
			ry: sy * sx * x + cx * y - cy * sx * z,
			rz: -sy * cx * x + sx * y + cy * cx * z,
		};
	}

	function cubicBezierAt(
		t: number,
		p0: number,
		p1: number,
		p2: number,
		p3: number,
	): number {
		const u = 1 - t;
		return (
			u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
		);
	}

	function cubicBezierDerivativeAt(
		t: number,
		p0: number,
		p1: number,
		p2: number,
		p3: number,
	): number {
		const u = 1 - t;
		return (
			3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2)
		);
	}

	function dynamicEase(value: number): number {
		const clamped = clamp(value, 0, 1);
		let t = clamped;
		for (let i = 0; i < 5; i++) {
			const x = cubicBezierAt(t, 0, 0.625, 0, 1);
			const dx = cubicBezierDerivativeAt(t, 0, 0.625, 0, 1);
			if (Math.abs(dx) < 1e-6) break;
			t = clamp(t - (x - clamped) / dx, 0, 1);
		}
		return cubicBezierAt(t, 0, 0.05, 1, 1);
	}

	function applyDisplayTransform(x: number, y: number, aspect: number) {
		const nextScale = Math.max(0.001, scale);
		const ax = x * aspect * nextScale;
		const ay = y * nextScale;

		return {
			x: (ax + offsetX * aspect * 2) / aspect,
			y: ay - offsetY * 2,
		};
	}

	$effect(() => {
		if (!updateUniforms) return;
		updateUniforms({
			scale,
			offsetX,
			offsetY,
			cellSize,
			ascii,
			shimmer,
			fresnelConfig: resolvedFresnelConfig,
			atmosphereConfig: resolvedAtmosphereConfig,
		});
	});

	$effect(() => {
		if (!syncFocusTarget) return;
		syncFocusTarget(focusOn);
	});

	const setupScene = (targetCanvas: HTMLCanvasElement) => {
		const renderer = new Renderer({
			canvas: targetCanvas,
			alpha: true,
			antialias: true,
			// Cap DPR: the globe is a full-screen fragment shader.
			dpr: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1,
		});
		const gl = renderer.gl;
		gl.clearColor(0, 0, 0, 0);

		targetCanvas.style.width = "100%";
		targetCanvas.style.height = "100%";

		const camera = new Camera(gl);
		camera.position.z = 1;

		const globeScene = new Transform();
		const atmosphereScene = new Transform();
		const geometry = new Triangle(gl);
		const markerData = new Array<number>(MAX_SHADER_MARKERS * 4).fill(0);
		const markerColorData = new Array<number>(MAX_SHADER_MARKERS * 3).fill(0);
		const landTexture = new Texture(gl, {
			image: new Uint8Array([0, 0, 0, 255]),
			width: 1,
			height: 1,
			format: gl.RGBA,
			type: gl.UNSIGNED_BYTE,
			minFilter: gl.NEAREST,
			magFilter: gl.NEAREST,
			generateMipmaps: false,
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
		});

		// Local patch: cells snap to whole framebuffer pixels so every tile, gap and grid line matches.
		const cellPixels = (cssWidth: number) => {
			const width = Math.max(4, Math.round(cssWidth * renderer.dpr));
			return { width, height: Math.round(width * CELL_ASPECT), gap: Math.max(1, Math.round(renderer.dpr)) };
		};
		let glyphCell = cellPixels(cellSize);
		const glyphTexture = new Texture(gl, {
			image: makeGlyphAtlas(glyphCell),
			minFilter: gl.NEAREST,
			magFilter: gl.NEAREST,
			generateMipmaps: false,
		});

		const uniforms = {
			uTime: { value: 0 },
			uResolution: { value: new Vec2(1, 1) },
			uRotation: { value: new Vec2(0, clampTheta(0, lockedPolarAngle)) },
			uScale: { value: DEFAULT_GLOBE_SCALE },
			uDisplayScale: { value: scale },
			uDisplayOffset: { value: new Vec2(offsetX, offsetY) },
			uBuffer: { value: new Vec2(1, 1) },
			uCell: { value: new Vec2(glyphCell.width, glyphCell.height) },
			uGap: { value: glyphCell.gap },
			uGlyphs: { value: glyphTexture },
			uGlyphCount: { value: GLYPHS.length },
			uShimmer: { value: shimmer ? 1 : 0 },
			uBaseColor: { value: new Vec3(0, 0, 0) },
			uRimColor: { value: new Vec3(0, 0, 0) },
			uRimPower: { value: resolvedFresnelConfig.rimPower },
			uRimIntensity: { value: resolvedFresnelConfig.rimIntensity },
			uAtmosphereColor: { value: new Vec3(0, 0, 0) },
			uAtmosphereScale: { value: resolvedAtmosphereConfig.scale },
			uAtmospherePower: { value: resolvedAtmosphereConfig.power },
			uAtmosphereCoefficient: { value: resolvedAtmosphereConfig.coefficient },
			uAtmosphereIntensity: { value: resolvedAtmosphereConfig.intensity },
			uLightDir: { value: new Vec3(0, 0, 0) },
			uPaper: { value: new Vec3(0, 0, 0) },
			uInk: { value: new Vec3(0, 0, 0) },
			uInkAlt: { value: new Vec3(0, 0, 0) },
			uSea: { value: new Vec3(0, 0, 0) },
			uInvert: { value: new Vec3(0, 0, 0) },
			uAccent: { value: new Vec3(0, 0, 0) },
			uAccentAlt: { value: new Vec3(0, 0, 0) },
			uLandTexture: { value: landTexture },
			uMarkerCount: { value: 0 },
			uMarkerData: { value: markerData },
			uMarkerColor: { value: markerColorData },
		};

		const vertexShader = `
			attribute vec2 uv;
			attribute vec2 position;
			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = vec4(position, 0.0, 1.0);
			}
		`;

		const globeFragmentShader = `
			precision highp float;

			uniform float uTime;
			uniform vec2 uResolution;
			uniform vec2 uRotation;
			uniform float uScale;
			uniform float uDisplayScale;
			uniform vec2 uDisplayOffset;
			uniform vec3 uLightDir;
			uniform sampler2D uLandTexture;
			uniform float uMarkerCount;
			uniform vec4 uMarkerData[${MAX_SHADER_MARKERS}];
			uniform vec3 uMarkerColor[${MAX_SHADER_MARKERS}];
			// Local patch: ASCII cells in whole framebuffer pixels, a glyph atlas drawn at exactly that size,
			// and an sRGB palette written straight to the canvas.
			uniform vec2 uBuffer;
			uniform vec2 uCell;
			uniform float uGap;
			uniform sampler2D uGlyphs;
			uniform float uGlyphCount;
			uniform float uShimmer;
			uniform vec3 uPaper;
			uniform vec3 uInk;
			uniform vec3 uInkAlt;
			uniform vec3 uSea;
			uniform vec3 uInvert;
			uniform vec3 uAccent;
			uniform vec3 uAccentAlt;

			const float kPi = 3.141592653589793;
			const float kSphereRadius = 0.8;
			const int kMaxMarkers = ${MAX_SHADER_MARKERS};

			float hash(vec2 p) {
				return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
			}

			vec2 transformUv(vec2 uv) {
				float aspect = uResolution.x / max(1.0, uResolution.y);
				vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
				vec2 transformed = (
					centered - vec2(uDisplayOffset.x * aspect, uDisplayOffset.y)
				) / max(uDisplayScale, 0.001);
				return vec2(transformed.x / aspect + 0.5, transformed.y + 0.5);
			}

			mat3 rotate(float theta, float phi) {
				float cx = cos(theta);
				float cy = cos(phi);
				float sx = sin(theta);
				float sy = sin(phi);
				return mat3(
					cy, sy * sx, -sy * cx,
					0.0, cx, sx,
					sy, cy * -sx, cy * cx
				);
			}

			vec2 pointToMaskUV(vec3 p) {
				float lengthP = length(p);
				if (lengthP <= 0.0) {
					return vec2(0.0, 0.0);
				}

				vec3 n = p / lengthP;

				float nx = n.z;
				float ny = n.y;
				float nz = -n.x;

				float gPhi = asin(clamp(ny, -1.0, 1.0));
				float cosPhi = cos(gPhi);

				float gTheta = 0.0;
				if (abs(cosPhi) > 1e-6) {
					float thetaInput = clamp(-nx / cosPhi, -1.0, 1.0);
					gTheta = acos(thetaInput);
					if (nz < 0.0) {
						gTheta = -gTheta;
					}
				}

				return vec2(
					fract((gTheta * 0.5) / kPi),
					fract(gPhi / kPi + 0.5)
				);
			}

			vec2 toGlobeSpace(vec2 screenUv) {
				vec2 uv = transformUv(screenUv) * 2.0 - 1.0;
				uv.x *= uResolution.x / max(1.0, uResolution.y);
				return uv / max(0.0001, uScale);
			}

			// Inverse of toGlobeSpace, returning framebuffer pixels.
			vec2 globeToPixel(vec2 uv) {
				float aspect = uResolution.x / max(1.0, uResolution.y);
				vec2 centered = uv * uScale * uDisplayScale * 0.5 + vec2(uDisplayOffset.x * aspect, uDisplayOffset.y);
				return vec2(centered.x / aspect + 0.5, centered.y + 0.5) * uBuffer;
			}

			// 1 where a framebuffer pixel lands on visible land.
			float landAt(vec2 px, mat3 rot) {
				vec2 uv = toGlobeSpace(px / uBuffer);
				float l = dot(uv, uv);
				float r2 = kSphereRadius * kSphereRadius;
				if (l >= r2) return 0.0;
				vec3 p = vec3(uv, sqrt(r2 - l)) / kSphereRadius;
				return step(0.5, texture2D(uLandTexture, pointToMaskUV(p * rot)).r);
			}

			void main() {
				// The ASCII grid is fixed to the screen; the globe turns underneath and every cell samples it.
				vec2 px = gl_FragCoord.xy;
				vec2 cell = floor(px / uCell);
				vec2 offset = px - cell * uCell;
				vec2 center = (cell + 0.5) * uCell;

				// Per-cell dice, re-rolled at each cell's own pace so the glyphs shimmer.
				float seed = hash(cell);
				float tick = floor(uTime * uShimmer * (0.4 + seed * 1.2) + seed * 13.0);
				float r1 = hash(cell + tick * 0.731);
				float r2 = hash(cell.yx + tick * 1.37 + 3.1);
				float r3 = hash(cell + tick * 2.17 + 7.7);

				float glyph = -1.0;
				vec3 glyphColor = uInk;
				float glyphAlpha = 0.0;
				vec3 tileColor = uInk;
				float tileAlpha = 0.0;

				vec2 centerUv = toGlobeSpace(center / uBuffer);
				float centerL = dot(centerUv, centerUv);
				float globeR2 = kSphereRadius * kSphereRadius;
				if (centerL < globeR2) {
					mat3 rot = rotate(uRotation.y, uRotation.x);
					vec3 normal = vec3(centerUv, sqrt(globeR2 - centerL)) / kSphereRadius;
					vec2 q = uCell * 0.25;
					float core = 0.25 * (
						landAt(center + vec2(-q.x, -q.y), rot) + landAt(center + vec2(q.x, -q.y), rot) +
						landAt(center + vec2(-q.x, q.y), rot) + landAt(center + vec2(q.x, q.y), rot)
					);
					vec3 lightVec = uLightDir.z > 0.5 ? vec3(uLightDir.xy, 0.6) : vec3(0.5, 0.5, 0.7);
					float day = smoothstep(-0.25, 0.75, dot(normal, normalize(lightVec)));
					// Cells dim toward the silhouette, and a rim brightest on the lit side outlines the sphere.
					float limb = smoothstep(0.0, 0.6, normal.z);
					float lit = smoothstep(-0.5, 0.9, dot(normalize(centerUv + 1e-5), normalize(lightVec.xy)));
					float rim = pow(1.0 - normal.z, 3.0) * mix(0.3, 1.0, lit);
					vec3 landInk = mix(uInk, uInkAlt, smoothstep(0.15, -0.35, (normal * rot).y));

					if (core > 0.0) {
						float level = clamp(core * mix(0.3, 1.0, day) * mix(0.45, 1.0, limb) + rim * 0.3 + (r1 - 0.5) * 0.3, 0.0, 1.0);
						// Mostly o t S % X; # and @ stay rare and usually sit in inverted cells.
						if (level < 0.15) glyph = floor(r2 * 7.0);
						else if (level < 0.4) glyph = 11.0 + floor(r2 * 2.0);
						else if (level > 0.8 && r3 > 0.92) glyph = 17.0 + floor(r2 * 2.0);
						else glyph = 11.0 + min(5.0, floor(r2 * 5.0 + (level - 0.4) * 1.5));
						glyphColor = landInk;
						glyphAlpha = mix(0.6, 1.0, level);
						tileColor = landInk;
						tileAlpha = mix(0.06, 0.2, level);
						if (level > 0.72 && r3 < 0.12) {
							glyph = 16.0 + floor(r2 * 3.0);
							glyphColor = uPaper;
							glyphAlpha = 1.0;
							tileColor = mix(uInvert, landInk, 0.2);
							tileAlpha = 0.95;
						} else if (glyph >= 11.0 && r3 > 0.985) {
							glyphColor = r2 > 0.5 ? uAccent : uAccentAlt;
						}
					} else {
						// Ocean: dim dots and waves, so the whole sphere reads as one body.
						float sea = clamp(mix(0.12, 0.5, day) * mix(0.55, 1.0, limb) + rim * 0.75 + (r1 - 0.5) * 0.25, 0.0, 1.0);
						if (sea < 0.3) glyph = r2 < 0.6 ? 3.0 : 4.0;
						else glyph = 7.0 + floor(r2 * mix(2.0, 4.0, smoothstep(0.5, 0.85, sea)));
						glyphColor = uSea;
						glyphAlpha = mix(0.3, 0.85, sea);
						tileColor = uSea;
						tileAlpha = mix(0.03, 0.1, sea);
					}

					// Each marker fills only the one cell it falls in.
					for (int i = 0; i < kMaxMarkers; i++) {
						if (float(i) >= uMarkerCount) {
							break;
						}
						vec3 markerNormal = rot * uMarkerData[i].xyz;
						if (markerNormal.z > 0.15 && floor(globeToPixel(markerNormal.xy * kSphereRadius) / uCell) == cell) {
							glyph = 18.0;
							glyphColor = uPaper;
							glyphAlpha = 1.0;
							tileColor = uMarkerColor[i];
							tileAlpha = mix(0.6, 1.0, 0.5 + 0.5 * sin(uTime * uShimmer * 4.0));
						}
					}
				}

				// Sparse dim marks drift across the empty sky.
				if (glyph < 0.0 && seed > 0.996 && r1 > 0.45) {
					glyph = seed > 0.998 ? 7.0 : 3.0;
					glyphColor = uSea;
					glyphAlpha = 0.35;
				}

				// Glyph over its tile, tile over a one-pixel grid line on each cell's left and bottom edge.
				float ink = glyph < 0.0 ? 0.0 : texture2D(uGlyphs, vec2((glyph * uCell.x + offset.x) / (uGlyphCount * uCell.x), offset.y / uCell.y)).r;
				float glyphA = ink * glyphAlpha;
				float tileA = offset.x > uGap && offset.y > uGap ? tileAlpha : 0.0;
				float gridA = offset.x < 1.0 || offset.y < 1.0 ? 0.035 : 0.0;
				float alpha = glyphA + tileA * (1.0 - glyphA);
				vec3 color = glyphColor * glyphA + tileColor * tileA * (1.0 - glyphA);
				color += uInk * gridA * (1.0 - alpha);
				alpha += gridA * (1.0 - alpha);
				gl_FragColor = vec4(alpha > 0.0 ? color / alpha : vec3(0.0), alpha);
			}
		`;

		const atmosphereFragmentShader = `
			precision highp float;

			varying vec2 vUv;

			uniform vec2 uResolution;
			uniform float uScale;
			uniform float uDisplayScale;
			uniform vec2 uDisplayOffset;
			uniform vec3 uAtmosphereColor;
			uniform float uAtmosphereScale;
			uniform float uAtmospherePower;
			uniform float uAtmosphereCoefficient;
			uniform float uAtmosphereIntensity;
			uniform vec3 uLightDir;

			const float kSphereRadius = 0.8;

			vec2 transformUv(vec2 uv) {
				float aspect = uResolution.x / max(1.0, uResolution.y);
				vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
				vec2 transformed = (
					centered - vec2(uDisplayOffset.x * aspect, uDisplayOffset.y)
				) / max(uDisplayScale, 0.001);
				return vec2(transformed.x / aspect + 0.5, transformed.y + 0.5);
			}

			vec3 linearToSrgb(vec3 color) {
				vec3 safe = max(color, vec3(0.0));
				vec3 low = safe * 12.92;
				vec3 high = 1.055 * pow(safe, vec3(1.0 / 2.4)) - 0.055;
				vec3 cutoff = step(vec3(0.0031308), safe);
				return mix(low, high, cutoff);
			}

			void main() {
				vec2 uv = transformUv(vUv) * 2.0 - 1.0;
				uv.x *= uResolution.x / max(1.0, uResolution.y);
				uv /= max(0.0001, uScale);

				float globeR = kSphereRadius;
				float atmosphereR = kSphereRadius * max(1.0, uAtmosphereScale);
				float l = dot(uv, uv);
				float radial = sqrt(l);

				if (radial <= globeR) {
					discard;
				}

				float shellWidth = max(1e-5, atmosphereR - globeR);
				float x = (radial - globeR) / shellWidth;
				if (x > 3.0) {
					discard;
				}

				// Smooth outward blur profile (no hard ring cutoff at shell boundary).
				float falloff = exp(-pow(max(0.0, x), 1.2) * max(0.15, uAtmospherePower * 0.09));
				float finalFactor =
					falloff * uAtmosphereIntensity * max(0.0, uAtmosphereCoefficient);

				finalFactor *= uLightDir.z > 0.5 ? mix(0.35, 1.3, smoothstep(-0.5, 0.9, dot(uv / max(1e-4, radial), normalize(uLightDir.xy)))) : 1.0;

				vec3 finalColor = uAtmosphereColor * finalFactor;
				float alpha = finalFactor;

				gl_FragColor = vec4(linearToSrgb(finalColor), clamp(alpha, 0.0, 1.0));
			}
		`;

		const globeProgram = new Program(gl, {
			vertex: vertexShader,
			fragment: globeFragmentShader,
			uniforms,
			// Local patch: no blending, so the straight-alpha ASCII output reaches the page as written.
			transparent: false,
			depthTest: false,
			depthWrite: false,
		});

		const atmosphereProgram = new Program(gl, {
			vertex: vertexShader,
			fragment: atmosphereFragmentShader,
			uniforms,
			transparent: true,
			depthTest: false,
			depthWrite: false,
		});
		atmosphereProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

		const globeMesh = new Mesh(gl, {
			geometry,
			program: globeProgram,
			frustumCulled: false,
		});
		globeMesh.setParent(globeScene);

		const atmosphereMesh = new Mesh(gl, {
			geometry,
			program: atmosphereProgram,
			frustumCulled: false,
		});
		atmosphereMesh.setParent(atmosphereScene);

		let currentScale = DEFAULT_GLOBE_SCALE;
		const setColor = (
			target: Vec3,
			value: ColorRepresentation,
			fallback: [number, number, number],
		) => {
			const [r, g, b] = toLinearRgb(value, fallback);
			target.set(r, g, b);
		};

		updateUniforms = (state) => {
			currentScale = DEFAULT_GLOBE_SCALE;
			uniforms.uScale.value = currentScale;
			uniforms.uDisplayScale.value = Math.max(0.001, state.scale);
			uniforms.uDisplayOffset.value.set(state.offsetX, state.offsetY);
			const nextCell = cellPixels(state.cellSize);
			if (nextCell.width !== glyphCell.width) {
				glyphCell = nextCell;
				glyphTexture.image = makeGlyphAtlas(glyphCell);
				glyphTexture.needsUpdate = true;
			}
			uniforms.uCell.value.set(glyphCell.width, glyphCell.height);
			uniforms.uGap.value = glyphCell.gap;
			uniforms.uShimmer.value = state.shimmer ? 1 : 0;

			setColor(uniforms.uBaseColor.value, state.fresnelConfig.color, [
				17 / 255,
				17 / 255,
				19 / 255,
			]);
			setColor(uniforms.uRimColor.value, state.fresnelConfig.rimColor, [
				1,
				105 / 255,
				0,
			]);
			uniforms.uRimPower.value = Math.max(0.0001, state.fresnelConfig.rimPower);
			uniforms.uRimIntensity.value = Math.max(
				0,
				state.fresnelConfig.rimIntensity,
			);

			setColor(uniforms.uAtmosphereColor.value, state.atmosphereConfig.color, [
				1,
				105 / 255,
				0,
			]);
			uniforms.uAtmosphereScale.value = Math.max(
				1,
				state.atmosphereConfig.scale,
			);
			uniforms.uAtmospherePower.value = Math.max(
				0.0001,
				state.atmosphereConfig.power,
			);
			uniforms.uAtmosphereCoefficient.value = Math.max(
				0,
				state.atmosphereConfig.coefficient,
			);
			uniforms.uAtmosphereIntensity.value = Math.max(
				0,
				state.atmosphereConfig.intensity,
			);

			// The ASCII shader mixes and outputs sRGB directly, so these skip the linear conversion.
			const setSrgb = (target: Vec3, value: string) => {
				const [r, g, b] = toRgb(value, [1, 1, 1]);
				target.set(r, g, b);
			};
			setSrgb(uniforms.uPaper.value, state.ascii.paper);
			setSrgb(uniforms.uInk.value, state.ascii.ink);
			setSrgb(uniforms.uInkAlt.value, state.ascii.inkAlt);
			setSrgb(uniforms.uSea.value, state.ascii.sea);
			setSrgb(uniforms.uInvert.value, state.ascii.invert);
			setSrgb(uniforms.uAccent.value, state.ascii.accent[0]);
			setSrgb(uniforms.uAccentAlt.value, state.ascii.accent[1]);
		};

		updateUniforms({
			scale,
			offsetX,
			offsetY,
			cellSize,
			ascii,
			shimmer,
			fresnelConfig: resolvedFresnelConfig,
			atmosphereConfig: resolvedAtmosphereConfig,
		});

		let width = 1;
		let height = 1;

		const startTheta = clampTheta(0, lockedPolarAngle);
		let phi = 0;
		let theta = startTheta;
		let targetPhi = phi;
		let targetTheta = startTheta;

		const syncMarkers = (
			currentPhi: number,
			currentTheta: number,
			currentScaleValue: number,
		) => {
			const markerRadius = COBE_GLOBE_RADIUS;
			const aspect = width / Math.max(1, height);
			const markerCount = Math.min(markers.length, MAX_SHADER_MARKERS);
			markerData.fill(0);
			markerColorData.fill(0);
			uniforms.uMarkerCount.value = markerCount;

			const nextMarkers: ProjectedMarker[] = [];
			for (let index = 0; index < markers.length; index++) {
				const marker = markers[index];
				const pos = lonLatToCartesian(
					marker.location[1],
					marker.location[0],
					markerRadius,
				);
				const rotated = applyRotation(
					pos.x,
					pos.y,
					pos.z,
					currentPhi,
					currentTheta,
				);

				const ndcX = (rotated.rx / aspect) * currentScaleValue;
				const ndcY = -rotated.ry * currentScaleValue;
				const transformed = applyDisplayTransform(ndcX, ndcY, aspect);
				const screenX = (transformed.x + 1) * 0.5;
				const screenY = (transformed.y + 1) * 0.5;

				const frontDot = rotated.rz / markerRadius;
				const rawVisibility = smoothstep(
					frontDot,
					VISIBILITY_MIN_DOT,
					VISIBILITY_MAX_DOT,
				);
				const visibility = dynamicEase(rawVisibility);

				nextMarkers.push({
					marker,
					index,
					screenX,
					screenY,
					visibility,
				});

				if (index >= markerCount) continue;

				const unitPos = lonLatToCartesian(
					marker.location[1],
					marker.location[0],
					1,
				);
				const markerDataOffset = index * 4;
				markerData[markerDataOffset] = unitPos.x;
				markerData[markerDataOffset + 1] = unitPos.y;
				markerData[markerDataOffset + 2] = unitPos.z;
				markerData[markerDataOffset + 3] = clamp(
					(marker.size ?? 0.05) * SHADER_MARKER_SIZE_SCALE,
					MIN_SHADER_MARKER_SIZE,
					MAX_SHADER_MARKER_SIZE,
				);

				const [r, g, b] = toRgb(marker.color ?? "#ffffff", [1, 1, 1]);
				const markerColorOffset = index * 3;
				markerColorData[markerColorOffset] = r;
				markerColorData[markerColorOffset + 1] = g;
				markerColorData[markerColorOffset + 2] = b;
			}

			projectedMarkers = nextMarkers;
		};

		syncFocusTarget = (target) => {
			focusTween?.kill();
			focusTween = null;

			if (!target) return;

			const [lat, lon] = target;
			const nextDirection = lonLatToCartesian(lon, lat, 1);
			const targetRotation = cartesianToRotation(
				nextDirection.x,
				nextDirection.y,
				nextDirection.z,
			);

			const desiredTheta = clampTheta(targetRotation.theta, lockedPolarAngle);
			const desiredPhi = shortestAngleTarget(targetPhi, targetRotation.phi);

			const tweenState = { phi: targetPhi, theta: targetTheta };
			focusTween = gsap.to(tweenState, {
				phi: desiredPhi,
				theta: desiredTheta,
				duration: 1.5,
				ease: "power2.inOut",
				onUpdate: () => {
					targetPhi = tweenState.phi;
					targetTheta = clampTheta(tweenState.theta, lockedPolarAngle);
				},
				overwrite: true,
			});
		};

		syncFocusTarget(focusOn);

		let dragging = false;
		let activePointerId = -1;
		let lastPointerX = 0;
		let lastPointerY = 0;

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			dragging = true;
			activePointerId = event.pointerId;
			lastPointerX = event.clientX;
			lastPointerY = event.clientY;
			targetCanvas.setPointerCapture(event.pointerId);
			focusTween?.kill();
			focusTween = null;
		};

		const onPointerMove = (event: PointerEvent) => {
			if (!dragging || event.pointerId !== activePointerId) return;
			const dx = event.clientX - lastPointerX;
			const dy = event.clientY - lastPointerY;
			lastPointerX = event.clientX;
			lastPointerY = event.clientY;

			targetPhi += dx * ROTATE_SENSITIVITY;
			targetTheta = clampTheta(
				targetTheta + dy * ROTATE_SENSITIVITY,
				lockedPolarAngle,
			);
		};

		const stopDragging = (event: PointerEvent) => {
			if (event.pointerId !== activePointerId) return;
			dragging = false;
			activePointerId = -1;
		};

		targetCanvas.addEventListener("pointerdown", onPointerDown);
		targetCanvas.addEventListener("pointermove", onPointerMove);
		targetCanvas.addEventListener("pointerup", stopDragging);
		targetCanvas.addEventListener("pointercancel", stopDragging);
		targetCanvas.addEventListener("lostpointercapture", stopDragging);

		let disposed = false;
		const image = new Image();
		image.onload = () => {
			if (disposed) return;
			landTexture.image = image;
			// No mipmaps: each cell samples one fixed uv, so derivatives would pick a wrong level on cell borders.
			landTexture.generateMipmaps = false;
			landTexture.minFilter = gl.LINEAR;
			landTexture.magFilter = gl.LINEAR;
			landTexture.needsUpdate = true;
		};
		image.onerror = (error) => {
			console.warn("GlobeScene: failed to load land mask texture", error);
		};
		image.src = landTextureUrl;

		let raf = 0;
		let previous = 0;
		const tick = (now: number) => {
			const w = Math.max(1, targetCanvas.clientWidth);
			const h = Math.max(1, targetCanvas.clientHeight);
			const bufW = Math.round(w * renderer.dpr);
			const bufH = Math.round(h * renderer.dpr);
			if (targetCanvas.width !== bufW || targetCanvas.height !== bufH) {
				targetCanvas.width = bufW;
				targetCanvas.height = bufH;
				renderer.width = w;
				renderer.height = h;
				renderer.state.viewport = { x: 0, y: 0, width: null, height: null };
				width = w;
				height = h;
				uniforms.uResolution.value.set(w, h);
				uniforms.uBuffer.value.set(bufW, bufH);
			}
			const delta = previous ? (now - previous) / 1000 : 0;
			previous = now;
			uniforms.uTime.value += delta;

			if (autoRotate) {
				targetPhi -= AUTO_ROTATE_SPEED * delta;
			}
			targetTheta = clampTheta(targetTheta, lockedPolarAngle);

			const easing = 1 - Math.exp(-delta * SMOOTHING_STRENGTH);
			phi += (targetPhi - phi) * easing;
			theta += (targetTheta - theta) * easing;

			const displayPhi = phi + rotationOffset;
			uniforms.uRotation.value.set(displayPhi, theta);

			syncMarkers(displayPhi, theta, currentScale);
			if (lightDirection) uniforms.uLightDir.value.set(lightDirection.x, lightDirection.y, 1);
			else uniforms.uLightDir.value.set(0, 0, 0);
			if (onFrame) {
				const aspect = width / Math.max(1, height);
				// Same orthographic projection as the markers; points behind the sphere report occluded.
				const project = (x: number, y: number, z: number) => {
					const r = applyRotation(x, y, z, displayPhi, theta);
					const t = applyDisplayTransform((r.rx / aspect) * currentScale, -r.ry * currentScale, aspect);
					return {
						x: (t.x + 1) * 0.5,
						y: (t.y + 1) * 0.5,
						depth: r.rz / COBE_GLOBE_RADIUS,
						occluded: r.rz < 0 && Math.hypot(r.rx, r.ry) < COBE_GLOBE_RADIUS,
						planar: Math.hypot(r.rx, r.ry) / COBE_GLOBE_RADIUS,
					};
				};
				onFrame({
					delta,
					height,
					project,
					projectLatLon: (lat: number, lon: number, altitude = 1) => {
						const p = lonLatToCartesian(lon, lat, COBE_GLOBE_RADIUS * altitude);
						return project(p.x, p.y, p.z);
					},
					radius: COBE_GLOBE_RADIUS,
					time: uniforms.uTime.value,
					width,
					cell: { width: glyphCell.width / renderer.dpr, height: glyphCell.height / renderer.dpr },
					// The shader counts rows from the bottom of the framebuffer, so snap from there too.
					snap: (x: number, y: number) => {
						const bottom = targetCanvas.height - y * renderer.dpr;
						return {
							x: ((Math.floor((x * renderer.dpr) / glyphCell.width) + 0.5) * glyphCell.width) / renderer.dpr,
							y: (targetCanvas.height - (Math.floor(bottom / glyphCell.height) + 0.5) * glyphCell.height) / renderer.dpr,
						};
					},
				});
			}
			renderer.render({ scene: globeScene, camera, clear: true });
			if (resolvedAtmosphereConfig.intensity > 0) renderer.render({ scene: atmosphereScene, camera, clear: false });
			raf = window.requestAnimationFrame(tick);
		};

		raf = window.requestAnimationFrame(tick);

		return () => {
			disposed = true;
			focusTween?.kill();
			focusTween = null;
			window.cancelAnimationFrame(raf);
			targetCanvas.removeEventListener("pointerdown", onPointerDown);
			targetCanvas.removeEventListener("pointermove", onPointerMove);
			targetCanvas.removeEventListener("pointerup", stopDragging);
			targetCanvas.removeEventListener("pointercancel", stopDragging);
			targetCanvas.removeEventListener("lostpointercapture", stopDragging);

			globeMesh.setParent(null);
			atmosphereMesh.setParent(null);
			geometry.remove();
			globeProgram.remove();
			atmosphereProgram.remove();
			if (landTexture.texture) gl.deleteTexture(landTexture.texture);
			if (glyphTexture.texture) gl.deleteTexture(glyphTexture.texture);
		};
	};

	const mountScene: Attachment<HTMLCanvasElement> = (targetCanvas) =>
		untrack(() => setupScene(targetCanvas));
</script>

<canvas
	{@attach mountScene}
	class="absolute inset-0 block h-full w-full"
	style="width:100%;height:100%;touch-action:none;"
	aria-hidden="true"
></canvas>

<div class="pointer-events-none absolute inset-0 overflow-hidden">
	{#each projectedMarkers as projected, i (projected.marker.label || i)}
		<GlobeMarkerItem
			marker={projected.marker}
			index={projected.index}
			screenX={projected.screenX}
			screenY={projected.screenY}
			visibility={projected.visibility}
			tooltip={markerTooltip}
		/>
	{/each}
</div>
