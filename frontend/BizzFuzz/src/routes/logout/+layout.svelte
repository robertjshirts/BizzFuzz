<script xmlns='http://www.w3.org/1999/html'>
    import Header from "$lib/Navigation/MainHeader.svelte";
    import '..//..//styles.css';
</script>

<div class="content_wrapper" >
    <Header />
    <slot></slot>
</div>


<style>
    .content_wrapper{
        margin-top: 2em;
        text-align: center;
    }



</style>