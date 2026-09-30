export interface GlobeMarker {
	/**
	 * Latitude and Longitude coordinates [lat, lon].
	 */
	location: [number, number];
	/**
	 * Size of the marker in world units.
	 * @default 0.05
	 */
	size?: number;
	/**
	 * Color of the marker.
	 * @default "#ffffff"
	 */
	color?: string;
	/**
	 * Optional fallback tooltip text (used when no custom tooltip renderer is provided).
	 */
	label?: string;
}

export interface GlobeMarkerTooltipContext {
	/**
	 * Marker currently being rendered.
	 */
	marker: GlobeMarker;
	/**
	 * Marker index in the markers array.
	 */
	index: number;
	/**
	 * Marker visibility factor in range [0, 1].
	 * 0 means fully hidden behind the globe, 1 means fully visible.
	 */
	visibility: number;
}

/**
 * Local patch: screen-space light direction, x to the right and y up.
 */
export interface GlobeLight {
	x: number;
	y: number;
}

export interface GlobePoint {
	/** Horizontal position in normalized [0, 1] viewport space. */
	x: number;
	/** Vertical position in normalized [0, 1] viewport space (top to bottom). */
	y: number;
	/** Depth toward the viewer in globe radii; negative is behind the center plane. */
	depth: number;
	/** True when the globe hides the point. */
	occluded: boolean;
	/** Screen-plane distance from the globe center in globe radii (1 = silhouette). */
	planar: number;
}

/**
 * Local patch: state passed to `onFrame` after each camera update.
 */
export interface GlobeFrame {
	time: number;
	delta: number;
	width: number;
	height: number;
	/** Globe radius in world units used by `project`. */
	radius: number;
	/** Project a world-space point (globe radius = `radius`) with the current rotation. */
	project: (x: number, y: number, z: number) => GlobePoint;
	/** Project latitude/longitude at `altitude` globe radii (1 = surface). */
	projectLatLon: (lat: number, lon: number, altitude?: number) => GlobePoint;
}
