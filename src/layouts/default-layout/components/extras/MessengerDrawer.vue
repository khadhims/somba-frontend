<template>
  <!--begin::Chat drawer backdrop-->
  <div
    v-if="drawers.messengerOpen"
    class="fixed inset-0 z-40 bg-black/50"
    @click="drawers.messengerOpen = false"
  ></div>
  <!--end::Chat drawer backdrop-->

  <!--begin::Chat drawer-->
  <div
    id="kt_drawer_chat"
    class="fixed inset-y-0 right-0 z-50 flex w-[300px] translate-x-full flex-col bg-white transition-transform duration-300 md:w-[500px] dark:bg-gray-900"
    :class="{ 'translate-x-0': drawers.messengerOpen }"
  >
    <!--begin::Messenger-->
    <div class="flex h-full w-full flex-col" id="kt_drawer_chat_messenger">
      <!--begin::Card header-->
      <div
        class="flex items-center justify-between border-b border-gray-200 py-5 pl-6 pr-5 dark:border-gray-700"
        id="kt_drawer_chat_messenger_header"
      >
        <!--begin::Title-->
        <div>
          <!--begin::User-->
          <div class="mr-3 flex flex-col justify-center">
            <a
              href="#"
              class="mb-2 mr-1 text-lg font-bold leading-none text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
              >Brian Cox</a
            >

            <!--begin::Info-->
            <div class="mb-0 flex items-center leading-none">
              <span
                class="mr-1 h-[10px] w-[10px] rounded-full bg-success"
              ></span>
              <span class="text-xs font-semibold text-gray-500">Active</span>
            </div>
            <!--end::Info-->
          </div>
          <!--end::User-->
        </div>
        <!--end::Title-->

        <!--begin::Card toolbar-->
        <div class="flex items-center">
          <!--begin::Menu-->
          <div
            class="relative mr-2"
            :ref="(el) => (menuDropdown.containerRef.value = el as HTMLElement | null)"
          >
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              @click="menuDropdown.toggle"
            >
              <i class="ki-duotone ki-dots-horizontal fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </button>
            <div
              v-show="menuDropdown.isOpen.value"
              class="absolute right-0 top-full z-20 mt-2"
            >
              <Dropdown4
                @close="menuDropdown.close"
                @invite-contacts="openInviteFriends"
              ></Dropdown4>
            </div>
          </div>
          <!--end::Menu-->

          <!--begin::Close-->
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
            id="kt_drawer_chat_close"
            @click="drawers.messengerOpen = false"
          >
            <KTIcon icon-name="cross" icon-class="fs-2x" />
          </button>
          <!--end::Close-->
        </div>
        <!--end::Card toolbar-->
      </div>
      <!--end::Card header-->

      <!--begin::Card body-->
      <div
        class="flex-1 overflow-y-auto px-5 py-4"
        id="kt_drawer_chat_messenger_body"
      >
        <!--begin::Messages-->
        <div ref="messagesRef" data-kt-element="messages">
          <template v-for="(item, index) in messages" :key="index">
            <MessageIn
              ref="messagesInRef"
              v-if="item.type === 'in'"
              :name="item.name"
              :image="item.image"
              :time="item.time"
              :text="item.text"
            ></MessageIn>
            <MessageOut
              ref="messagesOutRef"
              v-if="item.type === 'out'"
              :image="item.image"
              :time="item.time"
              :text="item.text"
            ></MessageOut>
          </template>
        </div>
        <!--end::Messages-->
      </div>
      <!--end::Card body-->

      <!--begin::Card footer-->
      <div
        class="border-t border-gray-200 px-5 pb-5 pt-4 dark:border-gray-700"
        id="kt_drawer_chat_messenger_footer"
      >
        <!--begin::Input-->
        <input
          class="mb-3 w-full border-0 border-b border-transparent bg-transparent px-0 py-2 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 dark:text-gray-100"
          data-kt-element="input"
          placeholder="Type a message"
          v-model="newMessageText"
          @keydown.enter="addNewMessage"
        />
        <!--end::Input-->

        <!--begin:Toolbar-->
        <div class="flex items-center justify-between">
          <!--begin::Actions-->
          <div class="mr-2 flex items-center">
            <button
              class="mr-1 flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
              type="button"
              title="Coming soon"
            >
              <i class="ki-duotone ki-paper-clip fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </button>
            <button
              class="mr-1 flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
              type="button"
              title="Coming soon"
            >
              <i class="ki-duotone ki-file-up fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
          <!--end::Actions-->

          <!--begin::Send-->
          <button
            @click="addNewMessage"
            class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
            type="button"
            data-kt-element="send"
          >
            Send
          </button>
          <!--end::Send-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card footer-->
    </div>
    <!--end::Messenger-->
  </div>
  <!--end::Chat drawer-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import MessageIn from "@/components/messenger-parts/MessageIn.vue";
import MessageOut from "@/components/messenger-parts/MessageOut.vue";
import Dropdown4 from "@/components/dropdown/Dropdown4.vue";
import { useDrawersStore } from "@/stores/drawers";
import { useDropdown } from "@/composables/useDropdown";

interface KTMessage {
  type: string;
  name?: string;
  image: string;
  time: string;
  text: string;
}

export default defineComponent({
  name: "upgrade-to-pro",
  components: {
    MessageIn,
    MessageOut,
    Dropdown4,
  },
  setup() {
    const drawers = useDrawersStore();
    const menuDropdown = useDropdown();
    const openInviteFriends = () => {
      menuDropdown.close();
      drawers.inviteFriendsOpen = true;
    };
    const messagesRef = ref<null | HTMLElement>(null);
    const messagesInRef = ref<null | HTMLElement>(null);
    const messagesOutRef = ref<null | HTMLElement>(null);

    const messages = ref<Array<KTMessage>>([
      {
        type: "in",
        name: "Brian Cox",
        image: getAssetPath("media/avatars/300-25.jpg"),
        time: "5 Hours",
        text: "How likely are you to recommend our company to your friends and family ?",
      },
      {
        type: "out",
        image: getAssetPath("media/avatars/300-1.jpg"),
        time: "2 Hours",
        text: "Hey there, we’re just writing to let you know that you’ve been subscribed to a repository on GitHub.",
      },
      {
        type: "in",
        name: "Brian Cox",
        image: getAssetPath("media/avatars/300-25.jpg"),
        time: "2 Hour",
        text: "Ok, Understood!",
      },
      {
        type: "out",
        image: getAssetPath("media/avatars/300-1.jpg"),
        time: "2 Hours",
        text: "You’ll receive notifications for all issues, pull requests!",
      },
      {
        type: "in",
        name: "Brian Cox",
        image: getAssetPath("media/avatars/300-25.jpg"),
        time: "1 Hour",
        text: "You can unwatch this repository immediately by clicking here: Keenthemes.com",
      },
      {
        type: "out",
        image: getAssetPath("media/avatars/300-1.jpg"),
        time: "4 mins",
        text: "Most purchased Business courses during this sale!",
      },
      {
        type: "in",
        name: "Brian Cox",
        image: getAssetPath("media/avatars/300-25.jpg"),
        time: "2 mins",
        text: "Company BBQ to celebrate the last quater achievements and goals. Food and drinks provided",
      },
    ]);

    const newMessageText = ref("");

    const addNewMessage = () => {
      if (!newMessageText.value) {
        return;
      }
      messages.value.push({
        type: "out",
        image: getAssetPath("media/avatars/300-1.jpg"),
        time: "Just now",
        text: newMessageText.value,
      });

      setTimeout(() => {
        if (messagesRef.value) {
          messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
        }
      }, 1);

      newMessageText.value = "";
      setTimeout(() => {
        messages.value.push({
          type: "in",
          name: "Ja Morant",
          image: getAssetPath("media/avatars/300-25.jpg"),
          time: "Just now",
          text: "Thank you for your awesome support!",
        });

        setTimeout(() => {
          if (messagesRef.value) {
            messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
          }
        }, 1);
      }, 2000);
    };

    return {
      drawers,
      menuDropdown,
      openInviteFriends,
      messages,
      messagesRef,
      newMessageText,
      addNewMessage,
      messagesInRef,
      messagesOutRef,
      getAssetPath,
    };
  },
});
</script>
