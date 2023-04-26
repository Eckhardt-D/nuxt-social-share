<script lang="ts" setup>
import { useAsyncData } from '#imports';
const {data: posts} = useAsyncData(() => $fetch('/api/posts'));
</script>

<template>
  <main style="width: 600px; margin: 0 auto;">
    <div
      v-for="post in posts"
      :key="post.id"
      class="post-card"
    >
      <SocialShare
        :url="`/posts/${post.id}`"
      />
      <h1>
        <NuxtLink
          style="color: black; text-decoration: none;"
          :to="`/posts/${post.id}`"
        >
          {{ post.title }}
        </NuxtLink>
      </h1>
      <p>{{ post.body.slice(0, 100) }}</p>
    </div>
  </main>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  font-family: sans-serif;
}

.post-card {
  padding: 1em;
  border: 1px solid #ddd;
  margin: 2em 0;
  border-radius: 6px;
}
</style>