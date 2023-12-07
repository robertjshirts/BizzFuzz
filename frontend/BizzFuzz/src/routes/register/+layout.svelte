<script>
    import '..//..//styles.css';
    import Header from "$lib/Navigation/MainHeader.svelte";
</script>

<div class="content_wrapper">
    <Header />
    <slot></slot>
</div>


<style>
    .content_wrapper{
        margin-top: 2em;
        text-align: center;
    }





</style>