<script>
   export let state = false;
   export let onClick;
</script>


<div>
   <div class="ball {state?"right":""}"></div>
   <button on:click={()=>{
      state = !state
      onClick();
   }}></button>
</div>


<style>

div{
   display: inline-block;
   margin: 4px;
}
button{
   background-color: #00000000;
   color: black;
   border: #f4f4f4 solid 2px;
   border-radius: 30px;
   width: 60px;
   height: 28px;
}
.ball{
   position: absolute;
   height: 18px;
   width: 18px;
   border-radius: 10px;
   background-color: #f4f4f4;
   margin: 5px;
   transition: all .7s ease;
   pointer-events: none;
}
.right{
   transform: translateX(32px);
}
</style>