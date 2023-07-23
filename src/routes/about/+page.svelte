<script>
   import Nav from '$lib/Nav.svelte'
   import PageTransition from '../../lib/PageTransition.svelte';
</script>

<PageTransition>
<Nav position="sticky"></Nav>
<div>
   <h1>About</h1>
   <p>
      5eBookBinder was created by <a href="https://github.com/aldottexe">Alex Lutz</a>. <br/>
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
      color: #f4f4f488
   }
   a{
      text-decoration: none;
      color: #f4f4f488;
      transition: color .5s;
   }
   a:hover{
      color: #f4f4f4
   }
</style>
