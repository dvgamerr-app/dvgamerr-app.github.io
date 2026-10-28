<script lang="ts">
  interface Props {
    /** Glyph rows centered on the origin; spaces stay empty. */
    rows: string[]
    /** ASCII cell size in CSS pixels, matching the globe grid. */
    cell: { width: number; height: number }
  }

  let { rows, cell }: Props = $props()

  // Heavy glyphs sit in inverted tiles, like the brightest cells on the globe.
  const SOLID = '@#8'

  const cells = $derived.by(() => {
    const columns = Math.max(...rows.map((row) => row.length))
    return rows.flatMap((row, r) =>
      [...row].flatMap((glyph, c) =>
        glyph === ' '
          ? []
          : [
              {
                glyph,
                solid: SOLID.includes(glyph),
                x: (c - (columns - 1) / 2) * cell.width,
                y: (r - (rows.length - 1) / 2) * cell.height,
              },
            ],
      ),
    )
  })
</script>

<!-- Colors come from --ascii-ink and --ascii-paper on an ancestor. -->
{#each cells as { glyph, solid, x, y } (`${x}:${y}`)}
  <g transform={`translate(${x} ${y})`}>
    <rect class={['tile', solid && 'solid']} x={1 - cell.width / 2} y={-cell.height / 2} width={cell.width - 1} height={cell.height - 1}
    ></rect>
    <text class={['glyph', solid && 'solid']} style:font-size={`${cell.height * 0.72}px`} text-anchor="middle" dominant-baseline="central"
      >{glyph}</text
    >
  </g>
{/each}

<style>
  .tile {
    fill: var(--ascii-ink);
    opacity: 0.18;
  }

  .tile.solid {
    opacity: 0.95;
  }

  .glyph {
    fill: var(--ascii-ink);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
    font-weight: 500;
  }

  .glyph.solid {
    fill: var(--ascii-paper);
  }
</style>
