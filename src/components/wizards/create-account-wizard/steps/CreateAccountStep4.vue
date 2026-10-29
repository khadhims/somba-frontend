<template>
  <!--begin::Step 4-->
  <div v-show="active">
    <!--begin::Wrapper-->
    <div class="w-full">
      <!--begin::Heading-->
      <div class="pb-10 lg:pb-15">
        <!--begin::Title-->
        <h2 class="font-bold text-gray-900 dark:text-gray-100">
          Billing Details
        </h2>
        <!--end::Title-->

        <!--begin::Notice-->
        <div class="text-sm font-semibold text-gray-500">
          If you need more info, please check out
          <a href="#" class="font-bold text-primary hover:underline"
            >Help Page</a
          >.
        </div>
        <!--end::Notice-->
      </div>
      <!--end::Heading-->

      <div class="w-full">
        <!--begin::Input group-->
        <div class="mb-7 flex flex-col">
          <!--begin::Label-->
          <label class="mb-2 flex items-center text-sm font-medium">
            <span class="after:content-['*'] after:ml-0.5 after:text-danger"
              >Name On Card</span
            >
            <KTIcon
              icon-name="information"
              icon-class="ms-2 fs-7"
              title="Specify a card holder's name"
            />
          </label>
          <!--end::Label-->

          <Field
            type="text"
            :class="formInputClass"
            placeholder=""
            name="nameOnCard"
          />
          <ErrorMessage
            class="mt-1 block text-sm text-danger"
            name="nameOnCard"
          />
        </div>
        <!--end::Input group-->

        <!--begin::Input group-->
        <div class="mb-7 flex flex-col">
          <!--begin::Label-->
          <label
            class="mb-2 text-sm font-medium after:content-['*'] after:ml-0.5 after:text-danger"
            >Card Number</label
          >
          <!--end::Label-->

          <!--begin::Input wrapper-->
          <div class="relative">
            <!--begin::Input-->
            <Field
              type="text"
              :class="formInputClass"
              placeholder="Enter card number"
              name="cardNumber"
            />
            <ErrorMessage
              class="mt-1 block text-sm text-danger"
              name="cardNumber"
            />
            <!--end::Input-->

            <!--begin::Card logos-->
            <div
              class="absolute right-0 top-1/2 mr-5 flex -translate-y-1/2 items-center gap-1"
            >
              <img
                :src="getAssetPath('media/svg/card-logos/visa.svg')"
                alt=""
                class="h-[25px]"
              />
              <img
                :src="getAssetPath('media/svg/card-logos/mastercard.svg')"
                alt=""
                class="h-[25px]"
              />
              <img
                :src="getAssetPath('media/svg/card-logos/american-express.svg')"
                alt=""
                class="h-[25px]"
              />
            </div>
            <!--end::Card logos-->
          </div>
          <!--end::Input wrapper-->
        </div>
        <!--end::Input group-->

        <!--begin::Input group-->
        <div class="grid grid-cols-1 gap-4 mb-10 md:grid-cols-12">
          <!--begin::Col-->
          <div class="md:col-span-8">
            <!--begin::Label-->
            <label
              class="mb-2 block text-sm font-medium after:content-['*'] after:ml-0.5 after:text-danger"
              >Expiration Date</label
            >
            <!--end::Label-->

            <!--begin::Row-->
            <div class="grid grid-cols-2 gap-4">
              <!--begin::Col-->
              <div>
                <Field
                  name="cardExpiryMonth"
                  :class="formInputClass"
                  placeholder="Month"
                  as="select"
                >
                  <option
                    v-for="i in 12"
                    :key="i"
                    :label="i.toString()"
                    :value="i"
                  ></option>
                </Field>
                <ErrorMessage
                  class="mt-1 block text-sm text-danger"
                  name="cardExpiryMonth"
                />
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div>
                <Field
                  name="cardExpiryYear"
                  :class="formInputClass"
                  placeholder="Year"
                  as="select"
                >
                  <option
                    v-for="i in 10"
                    :key="i"
                    :label="(i + (new Date().getFullYear() - 1)).toString()"
                    :value="i"
                  ></option>
                </Field>
                <ErrorMessage
                  class="mt-1 block text-sm text-danger"
                  name="cardExpiryYear"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div class="md:col-span-4">
            <!--begin::Label-->
            <label class="mb-2 flex items-center text-sm font-medium">
              <span class="after:content-['*'] after:ml-0.5 after:text-danger"
                >CVV</span
              >
              <KTIcon
                icon-name="information"
                icon-class="ms-2 fs-7"
                title="Enter a card CVV code"
              />
            </label>
            <!--end::Label-->

            <!--begin::Input wrapper-->
            <div class="relative">
              <!--begin::Input-->
              <Field
                type="text"
                :class="formInputClass"
                minlength="3"
                maxlength="4"
                placeholder="CVV"
                name="cardCvv"
              />
              <ErrorMessage
                class="mt-1 block text-sm text-danger"
                name="cardCvv"
              />
              <!--end::Input-->

              <!--begin::CVV icon-->
              <div class="absolute right-0 top-1/2 mr-3 -translate-y-1/2">
                <KTIcon icon-name="credit-cart" icon-class="fs-2hx" />
              </div>
              <!--end::CVV icon-->
            </div>
            <!--end::Input wrapper-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Input group-->

        <!--begin::Input group-->
        <div class="flex items-center justify-between">
          <!--begin::Label-->
          <div class="mr-5">
            <label class="text-sm font-medium"
              >Save Card for further billing?</label
            >
            <div class="text-xs font-semibold text-gray-500">
              If you need more info, please check budget planning
            </div>
          </div>
          <!--end::Label-->

          <!--begin::Switch-->
          <label class="inline-flex cursor-pointer items-center">
            <Field
              type="checkbox"
              class="peer sr-only"
              name="saveCard"
              value="1"
            />
            <span
              class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-5 dark:bg-gray-600"
            ></span>
            <span class="ml-3 text-sm font-semibold text-gray-500">
              Save Card
            </span>
          </label>
          <!--end::Switch-->
        </div>
        <!--end::Input group-->
      </div>
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::Step 4-->
</template>

<script setup lang="ts">
defineOptions({
  name: "CreateAccountStep4Component",
});

import { getAssetPath } from "@/core/helpers/assets";
import { ErrorMessage, Field } from "vee-validate";
import { formInputClass } from "@/core/helpers/badge";

defineProps<{ active: boolean }>();
</script>
