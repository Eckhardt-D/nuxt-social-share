<script lang="ts" setup>
import { ShareIcon, ClipboardIcon, CheckIcon } from "@heroicons/vue/24/outline/index";
import { ref, computed, onMounted, watch } from "vue";
import FacebookIcon from "./svgs/facebook-icon.vue";
import TwitterIcon from "./svgs/twitter-icon.vue";
import WhatsappIcon from "./svgs/whatsapp-icon.vue";
import LinkedinIcon from "./svgs/linkedin-icon.vue";
import RedditIcon from "./svgs/reddit-icon.vue";

type Platforms = "facebook" | "twitter" | "whatsapp" | "linkedin" | "reddit";

const currentLocation = ref(typeof location !== 'undefined' ? location.href : '');
const props = withDefaults(defineProps<{
  url?: string;
  platforms?: Platforms[];
}>(), {
  url: typeof location !== 'undefined' ? location.href : '',
  platforms: () => ["facebook", "twitter", "whatsapp", "linkedin", "reddit"]
})

// Set the URL to window location on client
// side if props.url is not defined
onMounted(() => {
  if (!props.url) {
    currentLocation.value = location.href;
  } else if (props.url.startsWith('http')) {
    currentLocation.value = props.url
  } else {
    currentLocation.value = new URL(props.url, location.origin).toString();
  }
})

// Make sure that the URL value changes with props.url
watch(() => props.url, (value: string) => {
  if (value) {
    if (value.startsWith('http')) {
    currentLocation.value = value
  } else {
    currentLocation.value = new URL(value, location.origin).toString();
  }
  }
})

const urls = computed(() => typeof window !== 'undefined' && ({
  facebook: `https://www.facebook.com/sharer.php?u=${currentLocation.value}`,
  twitter: `https://twitter.com/share?url=${currentLocation.value}`,
  whatsapp: `https://api.whatsapp.com/send?text=${currentLocation.value}`,
  linkedin: `https://www.linkedin.com/shareArticle?url=${currentLocation.value}`,
  reddit: `https://reddit.com/submit?url=${currentLocation.value}`,
}));

const socials = {
  facebook: {component: FacebookIcon, color: "#1877F2"},
  twitter: {component: TwitterIcon, color: "#1DA1F2"},
  whatsapp: {component: WhatsappIcon, color: "#25D366"},
  linkedin: {component: LinkedinIcon, color: "#0A66C2"},
  reddit: {component: RedditIcon, color: "#FF4500"},
}

const open = ref(false);
const copied = ref(false);

watch(() => copied.value, (value) => {
  if (value) {
    setTimeout(() => {
      copied.value = false
    }, 500)
  }
})

const on = {
  click: () => {
    open.value = !open.value
  },
}

const copyToClipboard = () => {
  try {
    navigator.clipboard.writeText(currentLocation.value);
    copied.value = true;
  } catch (error) { return }
}
</script>

<template>
  <section>
    <Teleport to="body">
      <div
        v-if="open"
        class="social-share-overlay"
        @click="open=false"
      >
        <div
          class="social-share-card"
          @click.stop
        >
          <button
            class="social-share-card__close"
            @click="on.click"
          >
            &times;
          </button>
          <h1 class="social-share-card__title">
            Love it? <span class="social-share--fancytext">Share</span> it!
          </h1>
          <div
            v-if="urls"
            class="social-share-buttons"
          >
            <a
              v-for="platform in platforms"
              :key="urls[platform]"
              :href="urls[platform]"
              class="social-share-buttons__button"
            >
              <component
                :is="socials[platform].component"
                width="24"
                :style="`fill: ${socials[platform].color}`"
                class="social-share-button__icon"
              />
            </a>
          </div>

          <div class="social-share-link">
            <input
              :value="currentLocation"
              type="text"
              class="social-share-link--input"
              disabled
            >
            <button
              class="social-share-link--button"
              @click="copyToClipboard"
            >
              <CheckIcon
                v-if="copied"
                style="width: 16px; color: green;"
              />
              <ClipboardIcon
                v-else
                style="width: 16px;"
              />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    <slot
      name="activator"
      v-bind="{ on }"
    >
      <button
        class="social-share-button__share"
        v-on="on"
      >
        <ShareIcon />
      </button>
    </slot>
  </section>
</template>

<style scoped>
.social-share-overlay {
  position: fixed;
  background: rgba(0,0,0,0.1);
  inset: 0;
  z-index: 99;
  display: grid;
  place-items: center;
}

.social-share-card {
  position: relative;
  background: #f4f4f4;
  box-shadow: 2px 2px 9px rgba(0,0,0,0.1);
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.1);
  padding: 2em;
  min-width: 350px;
  z-index: 100;
}

.social-share-card__close {
  font-weight: 500;
  position: absolute;
  top: 15px;
  right: 20px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 20px;
}

.social-share-card__close:hover {
  color: red;
}

.social-share-card__title {
  font-family: sans-serif;
  font-weight: 500;
  font-size: 28px;
  text-align: center;
  margin-bottom: 1em;
}

.social-share-buttons {
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
}

.social-share-buttons__button {
  border-radius: 100%;
  border: none;
  background: none;
  padding: 5px;
  cursor: pointer;
}

.social-share-button__share {
  background: none;
  border: 1px solid #ddd;
  border-radius: 100%;
  padding: 5px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #0A66C2;
}

.social-share-button__share:hover {
  box-shadow: 1px 1px 7px rgba(0,0,0,0.1);
}

.social-share-button__share > * {
  width: 100%;
  height: 100%;
}

.social-share--fancytext {
  position: relative;
}

.social-share--fancytext::after {
  content: "";
  position: absolute;
  border-radius: 3px;
  transform: rotate(-2deg);
  bottom: -2px;
  left: 0;
  right: 0px;
  height: 3px;
  background: linear-gradient(to right, #1877F2,#E4405F,#1DA1F2,#25D366,#0A66C2,#FF4500);
}

.social-share-link {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.social-share-link--input {
  padding: 8px 10px;
  border: none;
}

.social-share-link--button {
  border: none;
  border-left: 1px solid #ddd;
  cursor: pointer;
  background: transparent;
  flex-basis: 15%;
}
</style>