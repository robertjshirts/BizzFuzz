<script xmlns='http://www.w3.org/1999/html'>
    import Header from "$lib/Navigation/authorizedHeader.svelte";
    import '..//..//styles.css';
</script>

<div class="content_wrapper over" >
    <Header />
    <slot></slot>
</div>


<style>
    .content_wrapper{
        margin-top: 2em;
        text-align: center;
    }



</style>