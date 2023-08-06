<script>
   export let text = "click"
   export let href = "/"
   export let onclick = ()=>{'click'}
   export let delay = 1000;
   let link;
</script>
<button on:click={()=>{
      onclick();
      setTimeout(()=>link.click(), delay)
   }}>
   {text}
</button>
<a {href} bind:this={link}>
</a>
<style>
button{
   position: relative;
   /* background-color: #CC435E; */
   background-color: #00000000;
   color: #efefef;
   padding: 10px;
   padding-top: calc(100vh - 380px);
   font-size: 20px;
   border-radius: 20px;
   border: none;
   text-decoration: none;
   transition: all .1s;
   animation: blink alternate linear 1s infinite;
}
@keyframes blink{
   from{opacity:1;}
   to{opacity:.2;}
}
</style>
