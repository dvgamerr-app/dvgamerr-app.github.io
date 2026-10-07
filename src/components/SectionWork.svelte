<script lang="ts">
  interface Props {
    html: string
  }

  let { html }: Props = $props()
</script>

<div class="markdown work leading-7 px-2">{@html html}</div>
