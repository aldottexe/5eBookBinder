<script>
   import Nav from '$lib/Nav.svelte'
   import PageTransition from '../../lib/PageTransition.svelte';
</script>

<PageTransition>
<Nav position="sticky"></Nav>
<div>
   <h1>About</h1>
   <p>
      5eBookBinder was created by <a href="https://github.com/aldottexe">Alex Lutz</a>.  
      This site is definitely still a WIP so if you see any glitches, no you didn't.</p>
   <p>
      All game info is sourced from 
      <a href="http://dnd5e.wikidot.com/">5e.wikidot.com</a>
   </p>
</div>
</PageTransition>

<style>
   *{
      text-align: center;
   }
   p{
      text-align: left;
      color: #f4f4f488;
      width: 60%;
      margin: 0 auto 1rem auto;
   }
   a{
      text-decoration: none;
      color: #f4f4f488;
      transition: color .5s;
   }
   a:hover{
      color: #f4f4f4
   }
   @media(max-width: 850px){
      p{
         width: 80%;
      }
   }
</style>
