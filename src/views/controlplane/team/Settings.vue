<template>
  <!--begin::Basic info-->
  <div class="rounded-lg bg-white mb-5 xl:mb-10 dark:bg-gray-900">
    <!--begin::Card header-->
    <div
      class="flex items-center justify-between p-6 cursor-pointer"
      role="button"
      @click="profileDetailsOpen = !profileDetailsOpen"
      :aria-expanded="profileDetailsOpen"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="m-0">
        <h3 class="m-0 font-bold">Profile Details</h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_profile_details" v-show="profileDetailsOpen">
      <!--begin::Form-->
      <VForm
        id="kt_account_profile_details_form"
        class="form"
        novalidate
        @submit="saveChanges1()"
        :validation-schema="profileDetailsValidator"
      >
        <!--begin::Card body-->
        <div class="border-t border-gray-200 p-9 dark:border-gray-700">
          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2"
              >Avatar</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8">
              <!--begin::Image input-->
              <div
                class="relative h-[125px] w-[125px] rounded-full bg-cover bg-center"
                :style="{
                  backgroundImage: `url(${getAssetPath(
                    '/media/avatars/blank.png'
                  )})`,
                }"
              >
                <!--begin::Preview existing avatar-->
                <div
                  class="h-full w-full rounded-full bg-cover bg-center"
                  :style="`background-image: url(${profileDetails.avatar})`"
                ></div>
                <!--end::Preview existing avatar-->

                <!--begin::Label-->
                <label
                  class="absolute bottom-0 right-0 flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 shadow transition-colors hover:text-primary dark:bg-gray-800 dark:text-gray-300"
                  title="Change avatar"
                >
                  <i class="ki-duotone ki-pencil fs-7">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>

                  <!--begin::Inputs-->
                  <input type="file" name="avatar" accept=".png, .jpg, .jpeg" class="hidden" />
                  <input type="hidden" name="avatar_remove" />
                  <!--end::Inputs-->
                </label>
                <!--end::Label-->

                <!--begin::Remove-->
                <span
                  class="absolute right-0 top-0 flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 shadow transition-colors hover:text-danger dark:bg-gray-800 dark:text-gray-300"
                  @click="removeImage()"
                  title="Remove avatar"
                >
                  <i class="ki-duotone ki-cross fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </span>
                <!--end::Remove-->
              </div>
              <!--end::Image input-->

              <!--begin::Hint-->
              <div class="mt-1 text-sm text-gray-500">Allowed file types: png, jpg, jpeg.</div>
              <!--end::Hint-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2 after:content-['*'] after:ml-0.5 after:text-danger"
              >Full Name</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8">
              <!--begin::Row-->
              <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6">
                <!--begin::Col-->
                <div class="lg:col-span-6 fv-row">
                  <Field
                    type="text"
                    name="fname"
                    :class="[formInputClass, 'mb-3 lg:mb-0']"
                    placeholder="First name"
                    v-model="profileDetails.name"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="fname" />
                    </div>
                  </div>
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="lg:col-span-6 fv-row">
                  <Field
                    type="text"
                    name="lname"
                    :class="formInputClass"
                    placeholder="Last name"
                    v-model="profileDetails.surname"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="lname" />
                    </div>
                  </div>
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2 after:content-['*'] after:ml-0.5 after:text-danger"
              >Company</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <Field
                type="text"
                name="company"
                :class="formInputClass"
                placeholder="Company name"
                v-model="profileDetails.company"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="company" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2">
              <span class="after:content-['*'] after:ml-0.5 after:text-danger">Contact Phone</span>

              <i
                class="fas fa-exclamation-circle ms-1 fs-7"
                title="Phone number must be active"
              ></i>
            </label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <Field
                type="tel"
                name="phone"
                :class="formInputClass"
                placeholder="Phone number"
                v-model="profileDetails.contactPhone"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="phone" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2"
              >Company Site</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <Field
                type="text"
                name="website"
                :class="formInputClass"
                placeholder="Company website"
                v-model="profileDetails.companySite"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="website" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2">
              <span class="after:content-['*'] after:ml-0.5 after:text-danger">Country</span>

              <i
                class="fas fa-exclamation-circle ms-1 fs-7"
                title="Country of origination"
              ></i>
            </label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <Field
                as="select"
                name="country"
                :class="[formInputClass, 'font-semibold']"
                v-model="profileDetails.country"
              >
                <option value="AF">Afghanistan</option>
                <option value="AX">Aland Islands</option>
                <option value="AL">Albania</option>
                <option value="DZ">Algeria</option>
                <option value="AS">American Samoa</option>
                <option value="AD">Andorra</option>
                <option value="AO">Angola</option>
                <option value="AI">Anguilla</option>
                <option value="AQ">Antarctica</option>
                <option value="AG">Antigua and Barbuda</option>
                <option value="AR">Argentina</option>
                <option value="AM">Armenia</option>
                <option value="AW">Aruba</option>
                <option value="AU">Australia</option>
                <option value="AT">Austria</option>
                <option value="AZ">Azerbaijan</option>
                <option value="BS">Bahamas</option>
                <option value="BH">Bahrain</option>
                <option value="BD">Bangladesh</option>
                <option value="BB">Barbados</option>
                <option value="BY">Belarus</option>
                <option value="BE">Belgium</option>
                <option value="BZ">Belize</option>
                <option value="BJ">Benin</option>
                <option value="BM">Bermuda</option>
                <option value="BT">Bhutan</option>
                <option value="BO">Bolivia, Plurinational State of</option>
                <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                <option value="BA">Bosnia and Herzegovina</option>
                <option value="BW">Botswana</option>
                <option value="BV">Bouvet Island</option>
                <option value="BR">Brazil</option>
                <option value="IO">British Indian Ocean Territory</option>
                <option value="BN">Brunei Darussalam</option>
                <option value="BG">Bulgaria</option>
                <option value="BF">Burkina Faso</option>
                <option value="BI">Burundi</option>
                <option value="KH">Cambodia</option>
                <option value="CM">Cameroon</option>
                <option value="CA">Canada</option>
                <option value="CV">Cape Verde</option>
                <option value="KY">Cayman Islands</option>
                <option value="CF">Central African Republic</option>
                <option value="TD">Chad</option>
                <option value="CL">Chile</option>
                <option value="CN">China</option>
                <option value="CX">Christmas Island</option>
                <option value="CC">Cocos (Keeling) Islands</option>
                <option value="CO">Colombia</option>
                <option value="KM">Comoros</option>
                <option value="CG">Congo</option>
                <option value="CD">
                  Congo, the Democratic Republic of the
                </option>
                <option value="CK">Cook Islands</option>
                <option value="CR">Costa Rica</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="HR">Croatia</option>
                <option value="CU">Cuba</option>
                <option value="CW">Curaçao</option>
                <option value="CY">Cyprus</option>
                <option value="CZ">Czech Republic</option>
                <option value="DK">Denmark</option>
                <option value="DJ">Djibouti</option>
                <option value="DM">Dominica</option>
                <option value="DO">Dominican Republic</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egypt</option>
                <option value="SV">El Salvador</option>
                <option value="GQ">Equatorial Guinea</option>
                <option value="ER">Eritrea</option>
                <option value="EE">Estonia</option>
                <option value="ET">Ethiopia</option>
                <option value="FK">Falkland Islands (Malvinas)</option>
                <option value="FO">Faroe Islands</option>
                <option value="FJ">Fiji</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="GF">French Guiana</option>
                <option value="PF">French Polynesia</option>
                <option value="TF">French Southern Territories</option>
                <option value="GA">Gabon</option>
                <option value="GM">Gambia</option>
                <option value="GE">Georgia</option>
                <option value="DE">Germany</option>
                <option value="GH">Ghana</option>
                <option value="GI">Gibraltar</option>
                <option value="GR">Greece</option>
                <option value="GL">Greenland</option>
                <option value="GD">Grenada</option>
                <option value="GP">Guadeloupe</option>
                <option value="GU">Guam</option>
                <option value="GT">Guatemala</option>
                <option value="GG">Guernsey</option>
                <option value="GN">Guinea</option>
                <option value="GW">Guinea-Bissau</option>
                <option value="GY">Guyana</option>
                <option value="HT">Haiti</option>
                <option value="HM">Heard Island and McDonald Islands</option>
                <option value="VA">Holy See (Vatican City State)</option>
                <option value="HN">Honduras</option>
                <option value="HK">Hong Kong</option>
                <option value="HU">Hungary</option>
                <option value="IS">Iceland</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="IR">Iran, Islamic Republic of</option>
                <option value="IQ">Iraq</option>
                <option value="IE">Ireland</option>
                <option value="IM">Isle of Man</option>
                <option value="IL">Israel</option>
                <option value="IT">Italy</option>
                <option value="JM">Jamaica</option>
                <option value="JP">Japan</option>
                <option value="JE">Jersey</option>
                <option value="JO">Jordan</option>
                <option value="KZ">Kazakhstan</option>
                <option value="KE">Kenya</option>
                <option ue="KI">Kiribati</option>
                <option value="KP">
                  Korea, Democratic People's Republic of
                </option>
                <option value="KW">Kuwait</option>
                <option value="KG">Kyrgyzstan</option>
                <option value="LA">Lao People's Democratic Republic</option>
                <option value="LV">Latvia</option>
                <option value="LB">Lebanon</option>
                <option value="LS">Lesotho</option>
                <option value="LR">Liberia</option>
                <option value="LY">Libya</option>
                <option value="LI">Liechtenstein</option>
                <option value="LT">Lithuania</option>
                <option value="LU">Luxembourg</option>
                <option value="MO">Macao</option>
                <option value="MK">
                  Macedonia, the former Yugoslav Republic of
                </option>
                <option value="MG">Madagascar</option>
                <option value="MW">Malawi</option>
                <option value="MY">Malaysia</option>
                <option value="MV">Maldives</option>
                <option value="ML">Mali</option>
                <option value="MT">Malta</option>
                <option value="MH">Marshall Islands</option>
                <option value="MQ">Martinique</option>
                <option value="MR">Mauritania</option>
                <option value="MU">Mauritius</option>
                <option value="YT">Mayotte</option>
                <option value="MX">Mexico</option>
                <option value="FM">Micronesia, Federated States of</option>
                <option value="MD">Moldova, Republic of</option>
                <option value="MC">Monaco</option>
                <option value="MN">Mongolia</option>
                <option value="ME">Montenegro</option>
                <option value="MS">Montserrat</option>
                <option value="MA">Morocco</option>
                <option value="MZ">Mozambique</option>
                <option value="MM">Myanmar</option>
                <option value="NA">Namibia</option>
                <option value="NR">Nauru</option>
                <option value="NP">Nepal</option>
                <option value="NL">Netherlands</option>
                <option value="NC">New Caledonia</option>
                <option value="NZ">New Zealand</option>
                <option value="NI">Nicaragua</option>
                <option value="NE">Niger</option>
                <option value="NG">Nigeria</option>
                <option value="NU">Niue</option>
                <option value="NF">Norfolk Island</option>
                <option value="MP">Northern Mariana Islands</option>
                <option value="NO">Norway</option>
                <option value="OM">Oman</option>
                <option value="PK">Pakistan</option>
                <option value="PW">Palau</option>
                <option value="PS">Palestinian Territory, Occupied</option>
                <option value="PA">Panama</option>
                <option value="PG">Papua New Guinea</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Peru</option>
                <option value="PH">Philippines</option>
                <option value="PN">Pitcairn</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="PR">Puerto Rico</option>
                <option value="QA">Qatar</option>
                <option value="RE">Réunion</option>
                <option value="RO">Romania</option>
                <option value="RU">Russian Federation</option>
                <option value="RW">Rwanda</option>
                <option value="BL">Saint Barthélemy</option>
                <option value="SH">
                  Saint Helena, Ascension and Tristan da Cunha
                </option>
                <option value="KN">Saint Kitts and Nevis</option>
                <option value="LC">Saint Lucia</option>
                <option value="MF">Saint Martin (French part)</option>
                <option value="PM">Saint Pierre and Miquelon</option>
                <option value="VC">Saint Vincent and the Grenadines</option>
                <option value="WS">Samoa</option>
                <option value="SM">San Marino</option>
                <option value="ST">Sao Tome and Principe</option>
                <option value="SA">Saudi Arabia</option>
                <option value="SN">Senegal</option>
                <option value="RS">Serbia</option>
                <option value="SC">Seychelles</option>
                <option value="SL">Sierra Leone</option>
                <option value="SG">Singapore</option>
                <option value="SX">Sint Maarten (Dutch part)</option>
                <option value="SK">Slovakia</option>
                <option value="SI">Slovenia</option>
                <option value="SB">Solomon Islands</option>
                <option value="SO">Somalia</option>
                <option value="ZA">South Africa</option>
                <option value="GS">
                  South Georgia and the South Sandwich Islands
                </option>
                <option value="KR">South Korea</option>
                <option value="SS">South Sudan</option>
                <option value="ES">Spain</option>
                <option value="LK">Sri Lanka</option>
                <option value="SD">Sudan</option>
                <option value="SR">Suriname</option>
                <option value="SJ">Svalbard and Jan Mayen</option>
                <option value="SZ">Swaziland</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="SY">Syrian Arab Republic</option>
                <option value="TW">Taiwan, Province of China</option>
                <option value="TJ">Tajikistan</option>
                <option value="TZ">Tanzania, United Republic of</option>
                <option value="TH">Thailand</option>
                <option value="TL">Timor-Leste</option>
                <option value="TG">Togo</option>
                <option value="TK">Tokelau</option>
                <option value="TO">Tonga</option>
                <option value="TT">Trinidad and Tobago</option>
                <option value="TN">Tunisia</option>
                <option value="TR">Turkey</option>
                <option value="TM">Turkmenistan</option>
                <option value="TC">Turks and Caicos Islands</option>
                <option value="TV">Tuvalu</option>
                <option value="UG">Uganda</option>
                <option value="UA">Ukraine</option>
                <option value="AE">United Arab Emirates</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="UY">Uruguay</option>
                <option value="UZ">Uzbekistan</option>
                <option value="VU">Vanuatu</option>
                <option value="VE">Venezuela, Bolivarian Republic of</option>
                <option value="VN">Vietnam</option>
                <option value="VI">Virgin Islands</option>
                <option value="WF">Wallis and Futuna</option>
                <option value="EH">Western Sahara</option>
                <option value="YE">Yemen</option>
                <option value="ZM">Zambia</option>
                <option value="ZW">Zimbabwe</option>
              </Field>
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="country" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2 after:content-['*'] after:ml-0.5 after:text-danger"
              >Language</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <!--begin::Input-->
              <Field
                as="select"
                name="language"
                :class="formInputClass"
                v-model="profileDetails.language"
              >
                <option value="id">Bahasa Indonesia - Indonesian</option>
                <option value="msa">Bahasa Melayu - Malay</option>
                <option value="ca">Català - Catalan</option>
                <option value="cs">Čeština - Czech</option>
                <option value="da">Dansk - Danish</option>
                <option value="de">Deutsch - German</option>
                <option value="en">English</option>
                <option value="en-gb">English UK - British English</option>
                <option value="es">Español - Spanish</option>
                <option value="fil">Filipino</option>
                <option value="fr">Français - French</option>
                <option value="ga">Gaeilge - Irish (beta)</option>
                <option value="gl">Galego - Galician (beta)</option>
                <option value="hr">Hrvatski - Croatian</option>
                <option value="it">Italiano - Italian</option>
                <option value="hu">Magyar - Hungarian</option>
                <option value="nl">Nederlands - Dutch</option>
                <option value="no">Norsk - Norwegian</option>
                <option value="pl">Polski - Polish</option>
                <option value="pt">Português - Portuguese</option>
                <option value="ro">Română - Romanian</option>
                <option value="sk">Slovenčina - Slovak</option>
                <option value="fi">Suomi - Finnish</option>
                <option value="sv">Svenska - Swedish</option>
                <option value="vi">Tiếng Việt - Vietnamese</option>
                <option value="tr">Türkçe - Turkish</option>
                <option value="el">Ελληνικά - Greek</option>
                <option value="bg">Български език - Bulgarian</option>
                <option value="ru">Русский - Russian</option>
                <option value="sr">Српски - Serbian</option>
                <option value="uk">Українська мова - Ukrainian</option>
                <option value="he">עִבְרִית - Hebrew</option>
                <option value="ur">اردو - Urdu (beta)</option>
                <option value="ar">العربية - Arabic</option>
                <option value="fa">فارسی - Persian</option>
                <option value="mr">मराठी - Marathi</option>
                <option value="hi">हिन्दी - Hindi</option>
                <option value="bn">বাংলা - Bangla</option>
                <option value="gu">ગુજરાતી - Gujarati</option>
                <option value="ta">தமிழ் - Tamil</option>
                <option value="kn">ಕನ್ನಡ - Kannada</option>
                <option value="th">ภาษาไทย - Thai</option>
                <option value="ko">한국어 - Korean</option>
                <option value="ja">日本語 - Japanese</option>
                <option value="zh-cn">简体中文 - Simplified Chinese</option>
                <option value="zh-tw">繁體中文 - Traditional Chinese</option>
              </Field>
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="language" />
                </div>
              </div>
              <!--end::Input-->

              <!--begin::Hint-->
              <div class="mt-1 text-sm text-gray-500">
                Please select a preferred language, including date, time, and
                number formatting.
              </div>
              <!--end::Hint-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2 after:content-['*'] after:ml-0.5 after:text-danger"
              >Time Zone</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <Field
                as="select"
                name="timezone"
                :class="formInputClass"
                v-model="profileDetails.timezone"
              >
                <option
                  data-bs-offset="-39600"
                  value="International Date Line West"
                >
                  (GMT-11:00) International Date Line West
                </option>
                <option data-bs-offset="-39600" value="Midway Island">
                  (GMT-11:00) Midway Island
                </option>
                <option data-bs-offset="-39600" value="Samoa">
                  (GMT-11:00) Samoa
                </option>
                <option data-bs-offset="-36000" value="Hawaii">
                  (GMT-10:00) Hawaii
                </option>
                <option data-bs-offset="-28800" value="Alaska">
                  (GMT-08:00) Alaska
                </option>
                <option
                  data-bs-offset="-25200"
                  value="Pacific Time (US &amp; Canada)"
                >
                  (GMT-07:00) Pacific Time (US &amp; Canada)
                </option>
                <option data-bs-offset="-25200" value="Tijuana">
                  (GMT-07:00) Tijuana
                </option>
                <option data-bs-offset="-25200" value="Arizona">
                  (GMT-07:00) Arizona
                </option>
                <option
                  data-bs-offset="-21600"
                  value="Mountain Time (US &amp; Canada)"
                >
                  (GMT-06:00) Mountain Time (US &amp; Canada)
                </option>
                <option data-bs-offset="-21600" value="Chihuahua">
                  (GMT-06:00) Chihuahua
                </option>
                <option data-bs-offset="-21600" value="Mazatlan">
                  (GMT-06:00) Mazatlan
                </option>
                <option data-bs-offset="-21600" value="Saskatchewan">
                  (GMT-06:00) Saskatchewan
                </option>
                <option data-bs-offset="-21600" value="Central America">
                  (GMT-06:00) Central America
                </option>
                <option
                  data-bs-offset="-18000"
                  value="Central Time (US &amp; Canada)"
                >
                  (GMT-05:00) Central Time (US &amp; Canada)
                </option>
                <option data-bs-offset="-18000" value="Guadalajara">
                  (GMT-05:00) Guadalajara
                </option>
                <option data-bs-offset="-18000" value="Mexico City">
                  (GMT-05:00) Mexico City
                </option>
                <option data-bs-offset="-18000" value="Monterrey">
                  (GMT-05:00) Monterrey
                </option>
                <option data-bs-offset="-18000" value="Bogota">
                  (GMT-05:00) Bogota
                </option>
                <option data-bs-offset="-18000" value="Lima">
                  (GMT-05:00) Lima
                </option>
                <option data-bs-offset="-18000" value="Quito">
                  (GMT-05:00) Quito
                </option>
                <option
                  data-bs-offset="-14400"
                  value="Eastern Time (US &amp; Canada)"
                >
                  (GMT-04:00) Eastern Time (US &amp; Canada)
                </option>
                <option data-bs-offset="-14400" value="Indiana (East)">
                  (GMT-04:00) Indiana (East)
                </option>
                <option data-bs-offset="-14400" value="Caracas">
                  (GMT-04:00) Caracas
                </option>
                <option data-bs-offset="-14400" value="La Paz">
                  (GMT-04:00) La Paz
                </option>
                <option data-bs-offset="-14400" value="Georgetown">
                  (GMT-04:00) Georgetown
                </option>
                <option data-bs-offset="-10800" value="Atlantic Time (Canada)">
                  (GMT-03:00) Atlantic Time (Canada)
                </option>
                <option data-bs-offset="-10800" value="Santiago">
                  (GMT-03:00) Santiago
                </option>
                <option data-bs-offset="-10800" value="Brasilia">
                  (GMT-03:00) Brasilia
                </option>
                <option data-bs-offset="-10800" value="Buenos Aires">
                  (GMT-03:00) Buenos Aires
                </option>
                <option data-bs-offset="-9000" value="Newfoundland">
                  (GMT-02:30) Newfoundland
                </option>
                <option data-bs-offset="-7200" value="Greenland">
                  (GMT-02:00) Greenland
                </option>
                <option data-bs-offset="-7200" value="Mid-Atlantic">
                  (GMT-02:00) Mid-Atlantic
                </option>
                <option data-bs-offset="-3600" value="Cape Verde Is.">
                  (GMT-01:00) Cape Verde Is.
                </option>
                <option data-bs-offset="0" value="Azores">(GMT) Azores</option>
                <option data-bs-offset="0" value="Monrovia">
                  (GMT) Monrovia
                </option>
                <option data-bs-offset="0" value="UTC">(GMT) UTC</option>
                <option data-bs-offset="3600" value="Dublin">
                  (GMT+01:00) Dublin
                </option>
                <option data-bs-offset="3600" value="Edinburgh">
                  (GMT+01:00) Edinburgh
                </option>
                <option data-bs-offset="3600" value="Lisbon">
                  (GMT+01:00) Lisbon
                </option>
                <option data-bs-offset="3600" value="London">
                  (GMT+01:00) London
                </option>
                <option data-bs-offset="3600" value="Casablanca">
                  (GMT+01:00) Casablanca
                </option>
                <option data-bs-offset="3600" value="West Central Africa">
                  (GMT+01:00) West Central Africa
                </option>
                <option data-bs-offset="7200" value="Belgrade">
                  (GMT+02:00) Belgrade
                </option>
                <option data-bs-offset="7200" value="Bratislava">
                  (GMT+02:00) Bratislava
                </option>
                <option data-bs-offset="7200" value="Budapest">
                  (GMT+02:00) Budapest
                </option>
                <option data-bs-offset="7200" value="Ljubljana">
                  (GMT+02:00) Ljubljana
                </option>
                <option data-bs-offset="7200" value="Prague">
                  (GMT+02:00) Prague
                </option>
                <option data-bs-offset="7200" value="Sarajevo">
                  (GMT+02:00) Sarajevo
                </option>
                <option data-bs-offset="7200" value="Skopje">
                  (GMT+02:00) Skopje
                </option>
                <option data-bs-offset="7200" value="Warsaw">
                  (GMT+02:00) Warsaw
                </option>
                <option data-bs-offset="7200" value="Zagreb">
                  (GMT+02:00) Zagreb
                </option>
                <option data-bs-offset="7200" value="Brussels">
                  (GMT+02:00) Brussels
                </option>
                <option data-bs-offset="7200" value="Copenhagen">
                  (GMT+02:00) Copenhagen
                </option>
                <option data-bs-offset="7200" value="Madrid">
                  (GMT+02:00) Madrid
                </option>
                <option data-bs-offset="7200" value="Paris">
                  (GMT+02:00) Paris
                </option>
                <option data-bs-offset="7200" value="Amsterdam">
                  (GMT+02:00) Amsterdam
                </option>
                <option data-bs-offset="7200" value="Berlin">
                  (GMT+02:00) Berlin
                </option>
                <option data-bs-offset="7200" value="Bern">
                  (GMT+02:00) Bern
                </option>
                <option data-bs-offset="7200" value="Rome">
                  (GMT+02:00) Rome
                </option>
                <option data-bs-offset="7200" value="Stockholm">
                  (GMT+02:00) Stockholm
                </option>
                <option data-bs-offset="7200" value="Vienna">
                  (GMT+02:00) Vienna
                </option>
                <option data-bs-offset="7200" value="Cairo">
                  (GMT+02:00) Cairo
                </option>
                <option data-bs-offset="7200" value="Harare">
                  (GMT+02:00) Harare
                </option>
                <option data-bs-offset="7200" value="Pretoria">
                  (GMT+02:00) Pretoria
                </option>
                <option data-bs-offset="10800" value="Bucharest">
                  (GMT+03:00) Bucharest
                </option>
                <option data-bs-offset="10800" value="Helsinki">
                  (GMT+03:00) Helsinki
                </option>
                <option data-bs-offset="10800" value="Kiev">
                  (GMT+03:00) Kiev
                </option>
                <option data-bs-offset="10800" value="Kyiv">
                  (GMT+03:00) Kyiv
                </option>
                <option data-bs-offset="10800" value="Riga">
                  (GMT+03:00) Riga
                </option>
                <option data-bs-offset="10800" value="Sofia">
                  (GMT+03:00) Sofia
                </option>
                <option data-bs-offset="10800" value="Tallinn">
                  (GMT+03:00) Tallinn
                </option>
                <option data-bs-offset="10800" value="Vilnius">
                  (GMT+03:00) Vilnius
                </option>
                <option data-bs-offset="10800" value="Athens">
                  (GMT+03:00) Athens
                </option>
                <option data-bs-offset="10800" value="Istanbul">
                  (GMT+03:00) Istanbul
                </option>
                <option data-bs-offset="10800" value="Minsk">
                  (GMT+03:00) Minsk
                </option>
                <option data-bs-offset="10800" value="Jerusalem">
                  (GMT+03:00) Jerusalem
                </option>
                <option data-bs-offset="10800" value="Moscow">
                  (GMT+03:00) Moscow
                </option>
                <option data-bs-offset="10800" value="St. Petersburg">
                  (GMT+03:00) St. Petersburg
                </option>
                <option data-bs-offset="10800" value="Volgograd">
                  (GMT+03:00) Volgograd
                </option>
                <option data-bs-offset="10800" value="Kuwait">
                  (GMT+03:00) Kuwait
                </option>
                <option data-bs-offset="10800" value="Riyadh">
                  (GMT+03:00) Riyadh
                </option>
                <option data-bs-offset="10800" value="Nairobi">
                  (GMT+03:00) Nairobi
                </option>
                <option data-bs-offset="10800" value="Baghdad">
                  (GMT+03:00) Baghdad
                </option>
                <option data-bs-offset="14400" value="Abu Dhabi">
                  (GMT+04:00) Abu Dhabi
                </option>
                <option data-bs-offset="14400" value="Muscat">
                  (GMT+04:00) Muscat
                </option>
                <option data-bs-offset="14400" value="Baku">
                  (GMT+04:00) Baku
                </option>
                <option data-bs-offset="14400" value="Tbilisi">
                  (GMT+04:00) Tbilisi
                </option>
                <option data-bs-offset="14400" value="Yerevan">
                  (GMT+04:00) Yerevan
                </option>
                <option data-bs-offset="16200" value="Tehran">
                  (GMT+04:30) Tehran
                </option>
                <option data-bs-offset="16200" value="Kabul">
                  (GMT+04:30) Kabul
                </option>
                <option data-bs-offset="18000" value="Ekaterinburg">
                  (GMT+05:00) Ekaterinburg
                </option>
                <option data-bs-offset="18000" value="Islamabad">
                  (GMT+05:00) Islamabad
                </option>
                <option data-bs-offset="18000" value="Karachi">
                  (GMT+05:00) Karachi
                </option>
                <option data-bs-offset="18000" value="Tashkent">
                  (GMT+05:00) Tashkent
                </option>
                <option data-bs-offset="19800" value="Chennai">
                  (GMT+05:30) Chennai
                </option>
                <option data-bs-offset="19800" value="Kolkata">
                  (GMT+05:30) Kolkata
                </option>
                <option data-bs-offset="19800" value="Mumbai">
                  (GMT+05:30) Mumbai
                </option>
                <option data-bs-offset="19800" value="New Delhi">
                  (GMT+05:30) New Delhi
                </option>
                <option data-bs-offset="19800" value="Sri Jayawardenepura">
                  (GMT+05:30) Sri Jayawardenepura
                </option>
                <option data-bs-offset="20700" value="Kathmandu">
                  (GMT+05:45) Kathmandu
                </option>
                <option data-bs-offset="21600" value="Astana">
                  (GMT+06:00) Astana
                </option>
                <option data-bs-offset="21600" value="Dhaka">
                  (GMT+06:00) Dhaka
                </option>
                <option data-bs-offset="21600" value="Almaty">
                  (GMT+06:00) Almaty
                </option>
                <option data-bs-offset="21600" value="Urumqi">
                  (GMT+06:00) Urumqi
                </option>
                <option data-bs-offset="23400" value="Rangoon">
                  (GMT+06:30) Rangoon
                </option>
                <option data-bs-offset="25200" value="Novosibirsk">
                  (GMT+07:00) Novosibirsk
                </option>
                <option data-bs-offset="25200" value="Bangkok">
                  (GMT+07:00) Bangkok
                </option>
                <option data-bs-offset="25200" value="Hanoi">
                  (GMT+07:00) Hanoi
                </option>
                <option data-bs-offset="25200" value="Jakarta">
                  (GMT+07:00) Jakarta
                </option>
                <option data-bs-offset="25200" value="Krasnoyarsk">
                  (GMT+07:00) Krasnoyarsk
                </option>
                <option data-bs-offset="28800" value="Beijing">
                  (GMT+08:00) Beijing
                </option>
                <option data-bs-offset="28800" value="Chongqing">
                  (GMT+08:00) Chongqing
                </option>
                <option data-bs-offset="28800" value="Hong Kong">
                  (GMT+08:00) Hong Kong
                </option>
                <option data-bs-offset="28800" value="Kuala Lumpur">
                  (GMT+08:00) Kuala Lumpur
                </option>
                <option data-bs-offset="28800" value="Singapore">
                  (GMT+08:00) Singapore
                </option>
                <option data-bs-offset="28800" value="Taipei">
                  (GMT+08:00) Taipei
                </option>
                <option data-bs-offset="28800" value="Perth">
                  (GMT+08:00) Perth
                </option>
                <option data-bs-offset="28800" value="Irkutsk">
                  (GMT+08:00) Irkutsk
                </option>
                <option data-bs-offset="28800" value="Ulaan Bataar">
                  (GMT+08:00) Ulaan Bataar
                </option>
                <option data-bs-offset="32400" value="Seoul">
                  (GMT+09:00) Seoul
                </option>
                <option data-bs-offset="32400" value="Osaka">
                  (GMT+09:00) Osaka
                </option>
                <option data-bs-offset="32400" value="Sapporo">
                  (GMT+09:00) Sapporo
                </option>
                <option data-bs-offset="32400" value="Tokyo">
                  (GMT+09:00) Tokyo
                </option>
                <option data-bs-offset="32400" value="Yakutsk">
                  (GMT+09:00) Yakutsk
                </option>
                <option data-bs-offset="34200" value="Darwin">
                  (GMT+09:30) Darwin
                </option>
                <option data-bs-offset="34200" value="Adelaide">
                  (GMT+09:30) Adelaide
                </option>
                <option data-bs-offset="36000" value="Canberra">
                  (GMT+10:00) Canberra
                </option>
                <option data-bs-offset="36000" value="Melbourne">
                  (GMT+10:00) Melbourne
                </option>
                <option data-bs-offset="36000" value="Sydney">
                  (GMT+10:00) Sydney
                </option>
                <option data-bs-offset="36000" value="Brisbane">
                  (GMT+10:00) Brisbane
                </option>
                <option data-bs-offset="36000" value="Hobart">
                  (GMT+10:00) Hobart
                </option>
                <option data-bs-offset="36000" value="Vladivostok">
                  (GMT+10:00) Vladivostok
                </option>
                <option data-bs-offset="36000" value="Guam">
                  (GMT+10:00) Guam
                </option>
                <option data-bs-offset="36000" value="Port Moresby">
                  (GMT+10:00) Port Moresby
                </option>
                <option data-bs-offset="36000" value="Solomon Is.">
                  (GMT+10:00) Solomon Is.
                </option>
                <option data-bs-offset="39600" value="Magadan">
                  (GMT+11:00) Magadan
                </option>
                <option data-bs-offset="39600" value="New Caledonia">
                  (GMT+11:00) New Caledonia
                </option>
                <option data-bs-offset="43200" value="Fiji">
                  (GMT+12:00) Fiji
                </option>
                <option data-bs-offset="43200" value="Kamchatka">
                  (GMT+12:00) Kamchatka
                </option>
                <option data-bs-offset="43200" value="Marshall Is.">
                  (GMT+12:00) Marshall Is.
                </option>
                <option data-bs-offset="43200" value="Auckland">
                  (GMT+12:00) Auckland
                </option>
                <option data-bs-offset="43200" value="Wellington">
                  (GMT+12:00) Wellington
                </option>
                <option data-bs-offset="46800" value="Nuku'alofa">
                  (GMT+13:00) Nuku'alofa
                </option>
              </Field>
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="timezone" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2 after:content-['*'] after:ml-0.5 after:text-danger"
              >Currency</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <Field
                as="select"
                name="currency"
                :class="formInputClass"
                v-model="profileDetails.currency"
              >
                <option value="USD"><b>USD</b>&#160;-&#160;USA dollar</option>
                <option value="GBP">
                  <b>GBP</b>&#160;-&#160;British pound
                </option>
                <option value="AUD">
                  <b>AUD</b>&#160;-&#160;Australian dollar
                </option>
                <option value="JPY"><b>JPY</b>&#160;-&#160;Japanese yen</option>
                <option value="SEK">
                  <b>SEK</b>&#160;-&#160;Swedish krona
                </option>
                <option value="CAD">
                  <b>CAD</b>&#160;-&#160;Canadian dollar
                </option>
                <option value="CHF"><b>CHF</b>&#160;-&#160;Swiss franc</option>
              </Field>
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="currency" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2"
              >Communication</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="lg:col-span-8 fv-row">
              <!--begin::Options-->
              <div class="flex items-center mt-3">
                <!--begin::Option-->
                <label
                  class="mr-5 flex items-center"
                >
                  <input
                    class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                    name="communication[]"
                    type="checkbox"
                  />
                  <span class="pl-2 text-sm font-semibold"> Email </span>
                </label>
                <!--end::Option-->

                <!--begin::Option-->
                <label class="flex items-center">
                  <input
                    class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                    name="communication[]"
                    type="checkbox"
                  />
                  <span class="pl-2 text-sm font-semibold"> Phone </span>
                </label>
                <!--end::Option-->
              </div>
              <!--end::Options-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-0">
            <!--begin::Label-->
            <label class="lg:col-span-4 text-sm font-semibold lg:pt-2"
              >Allow Marketing</label
            >
            <!--begin::Label-->

            <!--begin::Label-->
            <div class="lg:col-span-8 flex items-center">
              <div class="fv-row">
                <label class="inline-flex cursor-pointer items-center">
                  <input type="checkbox" class="peer sr-only" id="allowmarketing" />
                  <span class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-5 dark:bg-gray-600"></span>
                </label>
              </div>
            </div>
            <!--begin::Label-->
          </div>
          <!--end::Input group-->
        </div>
        <!--end::Card body-->

        <!--begin::Actions-->
        <div class="flex justify-end py-6 px-9">
          <button
            type="reset"
            class="mr-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-primary-light hover:text-primary dark:bg-gray-800 dark:text-gray-300"
          >
            Discard
          </button>

          <button
            type="submit"
            id="kt_account_profile_details_submit"
            :disabled="isSubmitting1"
            class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
          >
          <span v-if="!isSubmitting1">Save Changes</span>
          <span v-else class="inline-flex items-center gap-2">
            Please wait...
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          </span>
          </button>
        </div>
        <!--end::Actions-->
      </VForm>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Basic info-->

  <!--begin::Sign-in Method-->
  <div class="rounded-lg bg-white mb-5 xl:mb-10 dark:bg-gray-900">
    <!--begin::Card header-->
    <div
      class="flex items-center justify-between p-6 cursor-pointer"
      role="button"
      @click="signinMethodOpen = !signinMethodOpen"
      :aria-expanded="signinMethodOpen"
      aria-controls="kt_account_signin_method"
    >
      <div class="m-0">
        <h3 class="m-0 font-extrabold">Sign-in Method</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_signin_method" v-show="signinMethodOpen">
      <!--begin::Card body-->
      <div class="border-t border-gray-200 p-9 dark:border-gray-700">
        <!--begin::Email Address-->
        <div class="flex flex-wrap items-center mb-8">
          <div id="kt_signin_email" :class="{ 'hidden': emailFormDisplay }">
            <div class="mb-1 text-lg font-extrabold">Email Address</div>
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400">
              support@keenthemes.com
            </div>
          </div>

          <div
            id="kt_signin_email_edit"
            :class="{ 'hidden': !emailFormDisplay }"
            class="flex-1"
          >
            <!--begin::Form-->
            <VForm
              id="kt_signin_change_email"
              class="form"
              novalidate
              @submit="updateEmail()"
              :validation-schema="changeEmail"
            >
              <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
                <div class="lg:col-span-6 mb-4 lg:mb-0">
                  <div class="fv-row mb-0">
                    <label
                      for="emailaddress"
                      class="mb-3 text-sm font-bold"
                      >Enter New Email Address</label
                    >
                    <Field
                      type="email"
                      :class="[formInputClass, 'font-semibold text-sm']"
                      id="emailaddress"
                      placeholder="Email Address"
                      name="emailaddress"
                      value="support@keenthemes.com"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="emailaddress" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="lg:col-span-6">
                  <div class="fv-row mb-0">
                    <label
                      for="confirmemailpassword"
                      class="mb-3 text-sm font-bold"
                      >Confirm Password</label
                    >
                    <Field
                      type="password"
                      :class="[formInputClass, 'font-semibold text-sm']"
                      name="confirmemailpassword"
                      id="confirmemailpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="confirmemailpassword" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex">
                <button
                  id="kt_signin_submit"
                  type="submit"
                  :disabled="isSubmittingEmail"
                  class="mr-2 rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
                >
                <span v-if="!isSubmittingEmail">Update Email</span>
                <span v-else class="inline-flex items-center gap-2">
                  Please wait...
                  <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </span>
                </button>
                <button
                  id="kt_signin_cancel"
                  type="button"
                  class="rounded-md px-6 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
                  @click="emailFormDisplay = !emailFormDisplay"
                >
                  Cancel
                </button>
              </div>
            </VForm>
            <!--end::Form-->
          </div>
          <div
            id="kt_signin_email_button"
            :class="{ 'hidden': emailFormDisplay }"
            class="ml-auto"
          >
            <button
              class="rounded-md bg-gray-100 px-6 py-2 text-sm font-extrabold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="emailFormDisplay = !emailFormDisplay"
            >
              Change Email
            </button>
          </div>
        </div>
        <!--end::Email Address-->

        <!--begin::Password-->
        <div class="flex flex-wrap items-center mb-8">
          <div
            id="kt_signin_password"
            :class="{ 'hidden': passwordFormDisplay }"
          >
            <div class="mb-1 text-lg font-extrabold">Password</div>
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400">************</div>
          </div>
          <div
            id="kt_signin_password_edit"
            class="flex-1"
            :class="{ 'hidden': !passwordFormDisplay }"
          >
            <div class="mb-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Password must be at least 8 character and contain symbols
            </div>

            <!--begin::Form-->
            <VForm
              id="kt_signin_change_password"
              class="form"
              novalidate
              @submit="updatePassword()"
              :validation-schema="changePassword"
            >
              <div class="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6 lg:items-start mb-6">
                <div class="lg:col-span-4">
                  <div class="fv-row mb-0">
                    <label
                      for="currentpassword"
                      class="mb-3 text-sm font-bold"
                      >Current Password</label
                    >
                    <Field
                      type="password"
                      :class="[formInputClass, 'font-semibold text-sm']"
                      name="currentpassword"
                      id="currentpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="currentpassword" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="lg:col-span-4">
                  <div class="fv-row mb-0">
                    <label
                      for="newpassword"
                      class="mb-3 text-sm font-bold"
                      >New Password</label
                    >
                    <Field
                      type="password"
                      :class="[formInputClass, 'font-semibold text-sm']"
                      name="newpassword"
                      id="newpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="newpassword" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="lg:col-span-4">
                  <div class="fv-row mb-0">
                    <label
                      for="confirmpassword"
                      class="mb-3 text-sm font-bold"
                      >Confirm New Password</label
                    >
                    <Field
                      type="password"
                      :class="[formInputClass, 'font-semibold text-sm']"
                      name="confirmpassword"
                      id="confirmpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="confirmpassword" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex">
                <button
                  id="kt_password_submit"
                  type="submit"
                  :disabled="isSubmittingPassword"
                  class="mr-2 rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
                >
                <span v-if="!isSubmittingPassword">Update Password</span>
                <span v-else class="inline-flex items-center gap-2">
                  Please wait...
                  <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </span>
                </button>
                <button
                  id="kt_password_cancel"
                  type="button"
                  @click="passwordFormDisplay = !passwordFormDisplay"
                  class="rounded-md px-6 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
                >
                  Cancel
                </button>
              </div>
            </VForm>
            <!--end::Form-->
          </div>
          <div
            id="kt_signin_password_button"
            class="ml-auto"
            :class="{ 'hidden': passwordFormDisplay }"
          >
            <button
              @click="passwordFormDisplay = !passwordFormDisplay"
              class="rounded-md bg-gray-100 px-4 py-2 text-sm font-extrabold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Reset Password
            </button>
          </div>
        </div>
        <!--end::Password-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Sign-in Method-->

  <!--begin::Connected Accounts-->
  <div class="rounded-lg bg-white mb-5 xl:mb-10 dark:bg-gray-900">
    <!--begin::Card header-->
    <div
      class="flex items-center justify-between p-6 cursor-pointer"
      role="button"
      @click="connectedAccountsOpen = !connectedAccountsOpen"
      :aria-expanded="connectedAccountsOpen"
      aria-controls="kt_account_connected_accounts"
    >
      <div class="m-0">
        <h3 class="m-0 font-bold">Connected Accounts</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_connected_accounts" v-show="connectedAccountsOpen">
      <!--begin::Card body-->
      <div class="border-t border-gray-200 p-9 dark:border-gray-700">
        <div
          class="flex rounded border border-dashed border-primary bg-primary-light mb-9 p-6"
        >
          <KTIcon
            icon-name="design-frame"
            icon-class="fs-2tx text-primary me-4"
          />

          <!--begin::Wrapper-->
          <div class="flex flex-1 items-center justify-between">
            <!--begin::Content-->
            <div class="font-semibold">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Two-factor authentication adds an extra layer of security to
                your account. To log in, in you'll need to provide a 4 digit
                amazing code. <a href="#" class="font-bold">Learn More</a>
              </div>
            </div>
            <!--end::Content-->
          </div>
          <!--end::Wrapper-->
        </div>

        <!--begin::Items-->
        <div class="py-2">
          <!--begin::Item-->
          <div class="flex items-center justify-between">
            <div class="flex">
              <img
                :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
                class="w-[30px] mr-6"
                alt=""
              />

              <div class="flex flex-col">
                <a
                  href="#"
                  class="text-base font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
                  >Google</a
                >
                <div class="text-sm font-semibold text-gray-500">
                  Plan properly your workflow
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <label class="inline-flex cursor-pointer items-center">
                <input type="checkbox" class="peer sr-only" id="googleswitch" checked />
                <span class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-5 dark:bg-gray-600"></span>
              </label>
            </div>
          </div>
          <!--end::Item-->

          <div class="border-t border-dashed border-gray-200 my-5 dark:border-gray-700"></div>

          <!--begin::Item-->
          <div class="flex items-center justify-between">
            <div class="flex">
              <img
                :src="getAssetPath('media/svg/brand-logos/github.svg')"
                class="w-[30px] mr-6"
                alt=""
              />

              <div class="flex flex-col">
                <a
                  href="#"
                  class="text-base font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
                  >Github</a
                >
                <div class="text-sm font-semibold text-gray-500">
                  Keep eye on on your Repositories
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <label class="inline-flex cursor-pointer items-center">
                <input type="checkbox" class="peer sr-only" id="githubswitch" checked />
                <span class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-5 dark:bg-gray-600"></span>
              </label>
            </div>
          </div>
          <!--end::Item-->

          <div class="border-t border-dashed border-gray-200 my-5 dark:border-gray-700"></div>

          <!--begin::Item-->
          <div class="flex items-center justify-between">
            <div class="flex">
              <img
                :src="getAssetPath('media/svg/brand-logos/slack-icon.svg')"
                class="w-[30px] mr-6"
                alt=""
              />

              <div class="flex flex-col">
                <a
                  href="#"
                  class="text-base font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
                  >Slack</a
                >
                <div class="text-sm font-semibold text-gray-500">
                  Integrate Projects Discussions
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <label class="inline-flex cursor-pointer items-center">
                <input type="checkbox" class="peer sr-only" id="slackswitch" />
                <span class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-5 dark:bg-gray-600"></span>
              </label>
            </div>
          </div>
          <!--end::Item-->
        </div>
        <!--end::Items-->
      </div>
      <!--end::Card body-->

      <!--begin::Card footer-->
      <div class="flex justify-end py-6 px-9">
        <button class="mr-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-primary-light hover:text-primary dark:bg-gray-800 dark:text-gray-300">
          Discard
        </button>
        <button
          class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
          @click="saveChanges2()"
          :disabled="isSubmitting2"
        >
          <span v-if="!isSubmitting2">Save Changes</span>
          <span v-else class="inline-flex items-center gap-2">
            Please wait...
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          </span>
        </button>
      </div>
      <!--end::Card footer-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Connected Accounts-->

  <!--begin::Notifications-->
  <div class="rounded-lg bg-white mb-5 xl:mb-10 dark:bg-gray-900">
    <!--begin::Card header-->
    <div
      class="flex items-center justify-between p-6 cursor-pointer"
      role="button"
      @click="emailPreferencesOpen = !emailPreferencesOpen"
      :aria-expanded="emailPreferencesOpen"
      aria-controls="kt_account_email_preferences"
    >
      <div class="m-0">
        <h3 class="m-0 font-bold">Email Preferences</h3>
      </div>
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_email_preferences" v-show="emailPreferencesOpen">
      <!--begin::Form-->
      <form class="form" @submit.prevent="saveChanges3()">
        <!--begin::Card body-->
        <div class="border-t border-gray-200 px-9 py-9 dark:border-gray-700">
          <!--begin::Option-->
          <label
            class="flex items-start cursor-pointer"
          >
            <!--begin::Input-->
            <input
              class="mt-0.5 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="flex flex-col items-start">
              <span class="mb-0 text-base font-bold">Successful Payments</span>
              <span class="text-sm text-gray-500"
                >Receive a notification for every successful payment.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="border-t border-dashed border-gray-200 my-6 dark:border-gray-700"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="flex items-start cursor-pointer"
          >
            <!--begin::Input-->
            <input
              class="mt-0.5 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              name="email-preferences1"
              checked
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="flex flex-col items-start">
              <span class="mb-0 text-base font-bold">Payouts</span>
              <span class="text-sm text-gray-500"
                >Receive a notification for every initiated payout.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="border-t border-dashed border-gray-200 my-6 dark:border-gray-700"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="flex items-start cursor-pointer"
          >
            <!--begin::Input-->
            <input
              class="mt-0.5 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="flex flex-col items-start">
              <span class="mb-0 text-base font-bold">Fee Collection</span>
              <span class="text-sm text-gray-500"
                >Receive a notification each time you collect a fee from
                sales</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="border-t border-dashed border-gray-200 my-6 dark:border-gray-700"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="flex items-start cursor-pointer"
          >
            <!--begin::Input-->
            <input
              class="mt-0.5 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              name="email-preferences1"
              checked
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="flex flex-col items-start">
              <span class="mb-0 text-base font-bold">Customer Payment Dispute</span>
              <span class="text-sm text-gray-500"
                >Receive a notification if a payment is disputed by a customer
                and for dispute purposes.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="border-t border-dashed border-gray-200 my-6 dark:border-gray-700"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="flex items-start cursor-pointer"
          >
            <!--begin::Input-->
            <input
              class="mt-0.5 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="flex flex-col items-start">
              <span class="mb-0 text-base font-bold">Refund Alerts</span>
              <span class="text-sm text-gray-500"
                >Receive a notification if a payment is stated as risk by the
                Finance Department.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="border-t border-dashed border-gray-200 my-6 dark:border-gray-700"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="flex items-start cursor-pointer"
          >
            <!--begin::Input-->
            <input
              class="mt-0.5 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              name="email-preferences1"
              checked
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="flex flex-col items-start">
              <span class="mb-0 text-base font-bold">Invoice Payments</span>
              <span class="text-sm text-gray-500"
                >Receive a notification if a customer sends an incorrect amount
                to pay their invoice.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="border-t border-dashed border-gray-200 my-6 dark:border-gray-700"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="flex items-start cursor-pointer"
          >
            <!--begin::Input-->
            <input
              class="mt-0.5 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="flex flex-col items-start">
              <span class="mb-0 text-base font-bold">Webhook API Endpoints</span>
              <span class="text-sm text-gray-500"
                >Receive notifications for consistently failing webhook API
                endpoints.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="border-t border-dashed border-gray-200 my-6 dark:border-gray-700"></div>
          <!--end::Option-->
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="flex justify-end py-6 px-9">
          <button class="mr-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-primary-light hover:text-primary dark:bg-gray-800 dark:text-gray-300">
            Discard
          </button>
          <button
            type="submit"
            class="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isSubmitting3"
          >
            <span v-if="!isSubmitting3">Save Changes</span>
            <span v-else class="inline-flex items-center gap-2">
              Please wait...
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            </span>
          </button>
        </div>
        <!--end::Card footer-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Notifications-->

  <!--begin::Notifications-->
  <div class="rounded-lg bg-white mb-5 xl:mb-10 dark:bg-gray-900">
    <!--begin::Card header-->
    <div
      class="flex items-center justify-between p-6 cursor-pointer"
      role="button"
      @click="notificationsOpen = !notificationsOpen"
      :aria-expanded="notificationsOpen"
      aria-controls="kt_account_notifications"
    >
      <div class="m-0">
        <h3 class="m-0 font-bold">Notifications</h3>
      </div>
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_notifications" v-show="notificationsOpen">
      <!--begin::Form-->
      <form class="form" @submit.prevent="saveChanges4()">
        <!--begin::Card body-->
        <div class="border-t border-gray-200 px-9 pt-3 pb-4 dark:border-gray-700">
          <!--begin::Table-->
          <div class="overflow-x-auto">
            <table
              class="w-full text-left"
            >
              <tbody class="text-sm font-semibold">
                <!--begin::Table row-->
                <tr>
                  <td class="min-w-[250px] border-b border-dashed border-gray-200 py-3 text-lg font-bold dark:border-gray-700">Notifications</td>
                  <td class="w-[125px] border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="kt_settings_notification_email"
                        checked
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="kt_settings_notification_email"
                      >
                        Email
                      </label>
                    </div>
                  </td>
                  <td class="w-[125px] border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="kt_settings_notification_phone"
                        checked
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="kt_settings_notification_phone"
                      >
                        Phone
                      </label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">Billing Updates</td>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value="1"
                        id="billing1"
                        checked
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="billing1"
                      ></label>
                    </div>
                  </td>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="billing2"
                        checked
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="billing2"
                      ></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">New Team Members</td>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="team1"
                        checked
                      />
                      <label class="pl-2 cursor-pointer" for="team1"></label>
                    </div>
                  </td>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="team2"
                      />
                      <label class="pl-2 cursor-pointer" for="team2"></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">Completed Projects</td>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="project1"
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="project1"
                      ></label>
                    </div>
                  </td>
                  <td class="border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="project2"
                        checked
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="project2"
                      ></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td class="border-b-0 py-3">Newsletters</td>
                  <td class="border-b-0 py-3">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="newsletter1"
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="newsletter1"
                      ></label>
                    </div>
                  </td>
                  <td class="border-b-0 py-3">
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                        type="checkbox"
                        value=""
                        id="newsletter2"
                      />
                      <label
                        class="pl-2 cursor-pointer"
                        for="newsletter2"
                      ></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->
              </tbody>
            </table>
          </div>
          <!--end::Table-->
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="flex justify-end py-6 px-9">
          <button class="mr-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-primary-light hover:text-primary dark:bg-gray-800 dark:text-gray-300">
            Discard
          </button>
          <button
            type="submit"
            class="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isSubmitting4"
          >
            <span v-if="!isSubmitting4">Save Changes</span>
            <span v-else class="inline-flex items-center gap-2">
              Please wait...
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            </span>
          </button>
        </div>
        <!--end::Card footer-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Notifications-->

  <!--begin::Deactivate Account-->
  <div class="rounded-lg bg-white mb-5 xl:mb-10 dark:bg-gray-900">
    <!--begin::Card header-->
    <div
      class="flex items-center justify-between p-6 cursor-pointer"
      role="button"
      @click="deactivateOpen = !deactivateOpen"
      :aria-expanded="deactivateOpen"
      aria-controls="kt_account_deactivate"
    >
      <div class="m-0">
        <h3 class="m-0 font-extrabold">Deactivate Account</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_deactivate" v-show="deactivateOpen">
      <!--begin::Form-->
      <form
        id="kt_account_deactivate_form"
        class="form"
        @submit.prevent="deactivateAccount()"
      >
        <!--begin::Card body-->
        <div class="border-t border-gray-200 p-9 dark:border-gray-700">
          <div
            class="flex rounded border border-dashed border-warning bg-warning-light mb-9 p-6"
          >
            <KTIcon
              icon-name="information-5"
              icon-class="fs-2tx text-warning me-4"
            />
            <!--begin::Wrapper-->
            <div class="flex flex-1 items-center justify-between">
              <!--begin::Content-->
              <div class="font-semibold">
                <h4 class="font-bold text-gray-800 dark:text-gray-200">
                  You Are Deactivating Your Account
                </h4>

                <div class="text-sm text-gray-600 dark:text-gray-400">
                  For extra security, this requires you to confirm your email or
                  phone number when you reset yousignr password. <br /><a
                    class="font-bold"
                    href="#"
                    >Learn more</a
                  >
                </div>
              </div>
              <!--end::Content-->
            </div>
            <!--end::Wrapper-->
          </div>

          <!--begin::Form input row-->
          <div class="flex items-center fv-row">
            <input
              name="deactivate"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
              type="checkbox"
              value=""
              id="deactivate"
            />
            <label
              class="pl-2 cursor-pointer text-sm font-semibold"
              for="deactivate"
              >Confirm Account Deactivation</label
            >
          </div>
          <!--end::Form input row-->
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="flex justify-end py-6 px-9">
          <button
            id="kt_account_deactivate_account_submit"
            type="submit"
            class="rounded-md bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isSubmitting5"
          >
            <span v-if="!isSubmitting5">Deactivate Account</span>
            <span v-else class="inline-flex items-center gap-2">
              Please wait...
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            </span>
          </button>
        </div>
        <!--end::Card footer-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Deactivate Account-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import { formInputClass, swalConfirmButtonClass } from "@/core/helpers/badge";

interface ProfileDetails {
  avatar: string;
  name: string;
  surname: string;
  company: string;
  contactPhone: string;
  companySite: string;
  country: string;
  language: string;
  timezone: string;
  currency: string;
  communications: {
    email: boolean;
    phone: boolean;
  };
  allowMarketing: boolean;
}

export default defineComponent({
  name: "team-settings",
  components: {
    ErrorMessage,
    Field,
    VForm,
  },
  setup() {
    // Was 7 `data-kt-indicator` button-loading toggles (setAttribute/
    // removeAttribute on element refs) - pure CSS in Metronic's SCSS,
    // ported to plain reactive booleans driving v-if/v-else in the template.
    const isSubmitting1 = ref(false);
    const isSubmitting2 = ref(false);
    const isSubmitting3 = ref(false);
    const isSubmitting4 = ref(false);
    const isSubmitting5 = ref(false);
    const isSubmittingEmail = ref(false);
    const isSubmittingPassword = ref(false);

    const emailFormDisplay = ref(false);
    const passwordFormDisplay = ref(false);

    // Was Bootstrap's `data-bs-toggle="collapse"` (works via the global
    // Collapse data-api side effect registered by importing `bootstrap`
    // anywhere in the app, same mechanism as Tab) - all 6 sections default
    // open, matching the original `collapse show` markup.
    const profileDetailsOpen = ref(true);
    const signinMethodOpen = ref(true);
    const connectedAccountsOpen = ref(true);
    const emailPreferencesOpen = ref(true);
    const notificationsOpen = ref(true);
    const deactivateOpen = ref(true);

    const profileDetailsValidator = Yup.object().shape({
      fname: Yup.string().required().label("First name"),
      lname: Yup.string().required().label("Last name"),
      company: Yup.string().required().label("Company"),
      phone: Yup.string().required().label("Contact phone"),
      website: Yup.string().label("Webside"),
      country: Yup.string().required().label("Country"),
      language: Yup.string().required().label("Language"),
      timezone: Yup.string().required().label("Timezone"),
      currency: Yup.string().required().label("Currency"),
    });

    const changeEmail = Yup.object().shape({
      emailaddress: Yup.string().required().email().label("Email"),
      confirmemailpassword: Yup.string().required().label("Password"),
    });

    const changePassword = Yup.object().shape({
      currentpassword: Yup.string().required().label("Current password"),
      newpassword: Yup.string().min(4).required().label("Password"),
      confirmpassword: Yup.string()
        .min(4)
        .required()
        .oneOf([Yup.ref("newpassword")], "Passwords must match")
        .label("Password Confirmation"),
    });

    const profileDetails = ref<ProfileDetails>({
      avatar: getAssetPath("media/avatars/300-1.jpg"),
      name: "Max",
      surname: "Smith",
      company: "Keenthemes",
      contactPhone: "044 3276 454 935",
      companySite: "keenthemes.com",
      country: "MY",
      language: "msa",
      timezone: "Kuala Lumpur",
      currency: "USD",
      communications: {
        email: false,
        phone: false,
      },
      allowMarketing: false,
    });

    const saveChanges1 = () => {
      isSubmitting1.value = true;
      setTimeout(() => {
        isSubmitting1.value = false;
      }, 2000);
    };

    const saveChanges2 = () => {
      isSubmitting2.value = true;
      setTimeout(() => {
        isSubmitting2.value = false;
      }, 2000);
    };

    const saveChanges3 = () => {
      isSubmitting3.value = true;
      setTimeout(() => {
        isSubmitting3.value = false;
      }, 2000);
    };

    const saveChanges4 = () => {
      isSubmitting4.value = true;
      setTimeout(() => {
        isSubmitting4.value = false;
      }, 2000);
    };

    const deactivateAccount = () => {
      isSubmitting5.value = true;
      setTimeout(() => {
        isSubmitting5.value = false;

        Swal.fire({
          text: "Email is successfully changed!",
          icon: "success",
          confirmButtonText: "Ok",
          buttonsStyling: false,
          heightAuto: false,
          customClass: {
            confirmButton: swalConfirmButtonClass,
          },
        }).then(() => {
          emailFormDisplay.value = false;
        });
      }, 2000);
    };

    const updateEmail = () => {
      isSubmittingEmail.value = true;
      setTimeout(() => {
        isSubmittingEmail.value = false;
        emailFormDisplay.value = false;
      }, 2000);
    };

    const updatePassword = () => {
      isSubmittingPassword.value = true;
      setTimeout(() => {
        isSubmittingPassword.value = false;

        Swal.fire({
          text: "Password is successfully changed!",
          icon: "success",
          confirmButtonText: "Ok",
          buttonsStyling: false,
          heightAuto: false,
          customClass: {
            confirmButton: swalConfirmButtonClass,
          },
        }).then(() => {
          passwordFormDisplay.value = false;
        });
      }, 2000);
    };

    const removeImage = () => {
      profileDetails.value.avatar = "/media/avatars/blank.png";
    };

    return {
      isSubmitting1,
      isSubmitting2,
      isSubmitting3,
      isSubmitting4,
      isSubmitting5,
      saveChanges1,
      saveChanges2,
      saveChanges3,
      saveChanges4,
      deactivateAccount,
      profileDetails,
      emailFormDisplay,
      passwordFormDisplay,
      removeImage,
      profileDetailsValidator,
      changeEmail,
      changePassword,
      isSubmittingEmail,
      isSubmittingPassword,
      updateEmail,
      updatePassword,
      getAssetPath,
      formInputClass,
      profileDetailsOpen,
      signinMethodOpen,
      connectedAccountsOpen,
      emailPreferencesOpen,
      notificationsOpen,
      deactivateOpen,
    };
  },
});
</script>
