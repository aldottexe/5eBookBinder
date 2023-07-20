<script>
   export let position = "static";
</script>

<nav style="position:{position}">
   <a href="/" >
      Home
   </a>
   <a href="/gen">
      Generator
   </a>
   <a href="/about">
      About
   </a>
</nav>

<style>
nav{
   display:flex;
}
nav a{
   text-decoration: none;
   color: white;
   margin: 20px;
   opacity: 100%;
   transition: opacity .5s;
   font-size: 21px;
}
nav a:hover{
   opacity: 50%;
}
</style>