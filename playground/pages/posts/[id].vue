<script lang="ts" setup>
import {useAsyncData, useRoute} from '#imports';
const {data:posts} = await useAsyncData(async () => $fetch("/api/posts"));
const {id} = useRoute().params;
const post = posts.value?.find(post => post?.id === Number(id))
</script>
<template>
  <div style="padding: 3em;">
    <!-- Lazy 😮 -->
    <LazySocialShare :url="`/posts/${post!.id}`" />
    <!--  -->
    <h1>{{ post!.title }} </h1>
    <p>{{ post!.body }}</p>
  </div>
</template>