<script>
   import {fade} from 'svelte/transition'
</script>

<div
    in:fade="{{ duration: 500, delay: 500 }}"
    out:fade="{{ duration: 500 }}" 
    >
    <slot></slot>
</div>
