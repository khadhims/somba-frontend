import { createI18n } from "vue-i18n";
import enControlplaneSite from "@/core/translate/en/controlplane/site.json";
import idControlplaneSite from "@/core/translate/id/controlplane/site.json";
import enControlplaneTeam from "@/core/translate/en/controlplane/team.json";
import idControlplaneTeam from "@/core/translate/id/controlplane/team.json";
import enControlplaneAccount from "@/core/translate/en/controlplane/account.json";
import idControlplaneAccount from "@/core/translate/id/controlplane/account.json";
import enControlplaneOrganization from "@/core/translate/en/controlplane/organization.json";
import idControlplaneOrganization from "@/core/translate/id/controlplane/organization.json";
import enAppsLiveView from "@/core/translate/en/apps/live-view.json";
import idAppsLiveView from "@/core/translate/id/apps/live-view.json";
import enAppsEventsAlerts from "@/core/translate/en/apps/events-alerts.json";
import idAppsEventsAlerts from "@/core/translate/id/apps/events-alerts.json";
import enAppsRecordingPlayback from "@/core/translate/en/apps/records-playback.json";
import idAppsRecordingPlayback from "@/core/translate/id/apps/records-playback.json";
import enAppsMonitoringCenter from "@/core/translate/en/apps/monitoring-center.json";
import idAppsMonitoringCenter from "@/core/translate/id/apps/monitoring-center.json";
import enComponentsMembership from "@/core/translate/en/components/membership.json";
import idComponentsMembership from "@/core/translate/id/components/membership.json";
import enDashboard from "@/core/translate/en/dashboard.json";
import idDashboard from "@/core/translate/id/dashboard.json";

export const APP_LOCALE_STORAGE_KEY = "app_locale";
const LEGACY_LOCALE_STORAGE_KEY = "lang";
export const AVAILABLE_LOCALES = ["en", "id"] as const;
export type AppLocale = (typeof AVAILABLE_LOCALES)[number];
const DEFAULT_LOCALE: AppLocale = "id";
const FALLBACK_LOCALE: AppLocale = "id";

const isAppLocale = (value: unknown): value is AppLocale => {
  return (
    typeof value === "string" &&
    AVAILABLE_LOCALES.some((locale) => locale === value)
  );
};

const readStoredLocale = (): AppLocale => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    const storage = window.localStorage;
    const stored =
      storage.getItem(APP_LOCALE_STORAGE_KEY) ||
      storage.getItem(LEGACY_LOCALE_STORAGE_KEY);

    if (isAppLocale(stored)) {
      storage.setItem(APP_LOCALE_STORAGE_KEY, stored);
      if (storage.getItem(LEGACY_LOCALE_STORAGE_KEY)) {
        storage.removeItem(LEGACY_LOCALE_STORAGE_KEY);
      }
      return stored;
    }
  } catch (e) {
    // ignore storage access issues
  }

  return DEFAULT_LOCALE;
};

const applyLocaleToDocument = (locale: AppLocale) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", locale);
  }
};

const mergeDeep = (
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> => {
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue)
    ) {
      if (
        !target[key] ||
        typeof target[key] !== "object" ||
        Array.isArray(target[key])
      ) {
        target[key] = {};
      }
      mergeDeep(target[key], sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
};

const messages = {
  en: {
    dashboard: "Dashboard",
    layoutBuilder: "Layout builder",
    home: "Home",
    dashboards: "Dashboards",
    layout: "Layout",
    wizard: "Wizard",
    site: "Site",
    craft: "Crafted",
    pages: "Pages",
    profile: "Profile",
    profileOverview: "Overview",
    projects: "Projects",
    campaigns: "Campaigns",
    documents: "Documents",
    connections: "Connections",
    wizards: "Wizards",
    horizontal: "Horizontal",
    vertical: "Vertical",
    account: "Account",
    organization: "Organization",
    team: "Team",
    accountOverview: "Overview",
    organizationOverview: "Overview",
    settings: "Settings",
    authentication: "Authentication",
    basicFlow: "Basic Flow",
    signIn: "Sign-in",
    signUp: "Sign-up",
    signOut: "Sign Out",
    signOutConfirm: "Are you sure you want to sign out?",
    passwordReset: "Password Reset",
    multiStepSignUp: "Multi-steps Sign up",
    error404: "Error 404",
    error500: "Error 500",
    apps: "Apps",
    chat: "Chat",
    privateChat: "Private Chat",
    groupChat: "Group Chat",
    drawerChat: "Drawer Chat",
    widgets: "Widgets",
    widgetsLists: "Lists",
    widgetsStatistics: "Statistics",
    widgetsCharts: "Charts",
    widgetsMixed: "Mixed",
    widgetsTables: "Tables",
    widgetsFeeds: "Feeds",
    changelog: "Changelog",
    docsAndComponents: "Docs & Components",
    megaMenu: "Mega Menu",
    exampleLink: "Example link",
    modals: "Modals",
    general: "General",
    inviteFriends: "Invite Friends",
    viewUsers: "View Users",
    upgradePlan: "Upgrade Plan",
    shareAndEarn: "Share & Earn",
    forms: "Forms",
    newTarget: "New Target",
    newCard: "New Card",
    newAddress: "New Address",
    createAPIKey: "Create API Key",
    twoFactorAuth: "Two Factor Auth",
    createApp: "Create App",
    createAccount: "Create Account",
    documentation: "Documentation",
    components: "Components",
    resources: "Resources",
    activity: "Activity",
    customers: "Customers",
    gettingStarted: "Getting Started",
    customersListing: "Customers Listing",
    customerDetails: "Customers Details",
    calendarApp: "Calendar",
    subscriptions: "Subscriptions",
    getStarted: "Getting Started",
    subscriptionList: "Subscription List",
    addSubscription: "Add Subscription",
    viewSubscription: "View Subscription",
    liveView: "Live View",
    eventsAlerts: "Events & Alerts",
    events: "Events",
    alerts: "Alerts",
    reportHarian: "Daily Report",
    recordingPlayback: "Recording & Playback",
    monitoringCenter: "Monitoring Center",
    overview: "Overview",
    siteManagement: "Site Management",
    siteConfiguration: "Site Configuration",
    roomManagement: "Room Management",
    nvrSystems: "NVR Systems",
    cameraManagement: "Camera Management",
    // Page titles
    "Dashboard": "Dashboard",
    "Layout Builder": "Layout Builder",
    "Overview": "Overview",
    "Projects": "Projects",
    "Campaigns": "Campaigns",
    "Documents": "Documents",
    "Connections": "Connections",
    "Activity": "Activity",
    "Horizontal": "Horizontal",
    "Vertical": "Vertical",
    "Room": "Room",
    "NVR": "NVR",
    "Camera": "Camera",
    "Settings": "Settings",
    "Live View": "Live View",
    "Events Management": "Events Management",
    "Alerts Management": "Alerts Management",
    "Report Harian": "Daily Report",
    "Events & Alerts Settings": "Events & Alerts Settings",
    "Recording & Playback Overview": "Recording & Playback Overview",
    "Recording & Playback Settings": "Recording & Playback Settings",
    "Monitoring Center Overview": "Monitoring Center Overview",
    "Monitoring Center Settings": "Monitoring Center Settings",
    "Sign In": "Sign In",
    "Sign Up": "Sign Up",
    "Password reset": "Password Reset",
    "Error 404": "Error 404",
    "Error 500": "Error 500",
    // Breadcrumbs
    "Home": "Home",
    "Apps": "Apps",
    "Site": "Site",
    "Account": "Account",
    "Organization": "Organization",
    "Team": "Team",
    "Pages": "Pages",
    "Profile": "Profile",
    "Wizard": "Wizard",
    "Layout": "Layout",
    "Dashboards": "Dashboards",
    "Events & Alerts": "Events & Alerts",
    "Recording & Playback": "Recording & Playback",
    "Monitoring Center": "Monitoring Center",
    selectOrganization: "Select Organization",
    loadingOrganizations: "Loading organizations...",
    selectAccount: "Select Account",
    selectOrganizationFirst: "Select organization first",
    loadingAccounts: "Loading accounts...",
    noAccounts: "No accounts available",
    selectTeam: "Select Team",
    selectAccountFirst: "Select account first",
    loadingTeams: "Loading teams...",
    noTeams: "No teams available",
    sitesOverview: "Sites Overview",
    totalSites: "Total Sites",
    activeSites: "Active Sites",
    totalVisitors: "Total Visitors",
    avgPerformance: "Avg Performance",
    items: "Items:",
    searchSites: "Search sites...",
    addSite: "Add Site",
    manageSites: "Manage sites",
    forYourTeam: "for your team",
    manageSitesForTeam: "Manage sites for team {name}",
    editSite: "Edit Site",
    deleteSite: "Delete Site",
    cancel: "Cancel",
    createSite: "Create Site",
    updateSite: "Update Site",
    delete: "Delete",
    itemsPerPage: "Items per page:",
    previous: "Previous",
    next: "Next",
    showingEntries: "Showing {from} to {to} of {total} entries",
    retry: "Retry",
    retrying: "Retrying...",
    loading: "Loading...",
    errorLoadingData: "Error Loading Data",
    noOrganizationSelected: "No Organization Selected",
    selectOrgToViewAccounts: "Please select an organization from the dropdown above to view payment accounts.",
    paymentAccountManagement: "Payment Account Management",
    managePaymentAccountsForOrg: "Manage payment accounts for {name}",
    noOrganizations: "No organizations available",
    paymentAccountsOverview: "Payment Accounts Overview",
    searchPaymentAccounts: "Search payment accounts...",
    addPaymentAccount: "Add Payment Account",
    // organization view
    totalOrganizations: "Total Organizations",
    totalTeam: "Total Team",
    totalUsers: "Total Users",
    totalCameras: "Total Camera",
    connectionError: "Connection Error",
    organizationsOverview: "Organizations Overview",
    searchOrganizations: "Search organizations...",
    noOrganizationsFound: "No organizations found",
    addOrganization: "Add Organization",
    editOrganization: "Edit Organization",
    deleteOrganization: "Delete Organization",
    createOrganization: "Create Organization",
    updateOrganization: "Update Organization",
    active: "Active",
    inactive: "Inactive",
    organizationName: "Organization Name",
    email: "Email",
    phone: "Phone",
    country: "Country",
    status: "Status",
    created: "Created",
    actions: "Actions",
    manageMembers: "Manage Members",
    manageAccounts: "Manage Accounts",
    manageOrganization: "Manage Organization",
    deleteConfirmation: "Are you sure you want to delete {name}?",
    thisActionCannotBeUndone: "This action cannot be undone.",
    teamManagement: "Team Management",
    manageTeamsForAccount: "Manage teams for {name}",
    manageTeams: "Manage teams",
    forYourAccount: "for your account",
    teamsOverview: "Teams Overview",
    searchTeams: "Search teams...",
    addTeam: "Add Team",
  },

  id: {
    dashboard: "Dasbor",
    layoutBuilder: "Pembuat Tata Letak",
    home: "Beranda",
    dashboards: "Dasbor",
    layout: "Tata Letak",
    wizard: "Panduan",
    site: "Lokasi",
    craft: "Dibuat",
    pages: "Halaman",
    profile: "Profil",
    profileOverview: "Ikhtisar",
    projects: "Proyek",
    campaigns: "Kampanye",
    documents: "Dokumen",
    connections: "Koneksi",
    wizards: "Panduan",
    horizontal: "Horizontal",
    vertical: "Vertikal",
    account: "Akun",
    organization: "Organisasi",
    team: "Tim",
    accountOverview: "Ikhtisar Akun",
    organizationOverview: "Ikhtisar Organisasi",
    settings: "Pengaturan",
    authentication: "Otentikasi",
    basicFlow: "Alur Dasar",
    signIn: "Masuk",
    signUp: "Daftar",
    signOut: "Keluar",
    signOutConfirm: "Apakah Anda yakin ingin keluar?",
    passwordReset: "Reset Kata Sandi",
    multiStepSignUp: "Daftar Multi-Langkah",
    error404: "Error 404",
    error500: "Error 500",
    apps: "Aplikasi",
    chat: "Chat",
    privateChat: "Chat Pribadi",
    groupChat: "Chat Grup",
    drawerChat: "Chat Drawer",
    widgets: "Widget",
    widgetsLists: "Daftar",
    widgetsStatistics: "Statistik",
    widgetsCharts: "Grafik",
    widgetsMixed: "Campuran",
    widgetsTables: "Tabel",
    widgetsFeeds: "Feed",
    changelog: "Log Perubahan",
    docsAndComponents: "Dokumentasi & Komponen",
    megaMenu: "Mega Menu",
    exampleLink: "Contoh Link",
    modals: "Modal",
    general: "Umum",
    inviteFriends: "Undang Teman",
    viewUsers: "Lihat Pengguna",
    upgradePlan: "Upgrade Paket",
    shareAndEarn: "Bagikan & Dapatkan",
    forms: "Form",
    newTarget: "Target Baru",
    newCard: "Kartu Baru",
    newAddress: "Alamat Baru",
    createAPIKey: "Buat API Key",
    twoFactorAuth: "Otentikasi Dua Faktor",
    createApp: "Buat Aplikasi",
    createAccount: "Buat Akun",
    documentation: "Dokumentasi",
    components: "Komponen",
    resources: "Sumber Daya",
    activity: "Aktivitas",
    customers: "Pelanggan",
    gettingStarted: "Memulai",
    customersListing: "Daftar Pelanggan",
    customerDetails: "Detail Pelanggan",
    calendarApp: "Kalender",
    subscriptions: "Langganan",
    getStarted: "Memulai",
    subscriptionList: "Daftar Langganan",
    addSubscription: "Tambah Langganan",
    viewSubscription: "Lihat Langganan",
    liveView: "Tampilan Langsung",
    eventsAlerts: "Kejadian & Peringatan",
    events: "Kejadian",
    alerts: "Peringatan",
    reportHarian: "Report Harian",
    recordingPlayback: "Rekaman & Putar Ulang",
    monitoringCenter: "Pusat Monitoring",
    overview: "Site",
    siteManagement: "Manajemen Site",
    siteConfiguration: "Konfigurasi Situs",
    roomManagement: "Manajemen Ruangan",
    nvrSystems: "Sistem NVR",
    cameraManagement: "Kamera",
    // Page titles
    "Dashboard": "Dasbor",
    "Layout Builder": "Pembuat Tata Letak",
    "Overview": "Ikhtisar",
    "Projects": "Proyek",
    "Campaigns": "Kampanye",
    "Documents": "Dokumen",
    "Connections": "Koneksi",
    "Activity": "Aktivitas",
    "Horizontal": "Horizontal",
    "Vertical": "Vertikal",
    "Room": "Ruangan",
    "NVR": "NVR",
    "camera": "Kamera",
    "Settings": "Pengaturan",
    "Live View": "Tampilan Langsung",
    "Events Management": "Ikhtisar Kejadian",
    "Alerts Management": "Ikhtisar Peringatan",
    "Report Harian": "Report Harian",
    "Events Overview": "Ikhtisar Kejadian",
    "Events Alerts": "Ikhtisar Peringatan",
    "Events & Alerts Settings": "Pengaturan Event & Peringatan",
    "Recording & Playback Overview": "Ikhtisar Rekaman & Putar Ulang",
    "Recording & Playback Settings": "Pengaturan Rekaman & Putar Ulang",
    "Monitoring Center Overview": "Ikhtisar Pusat Monitoring",
    "Monitoring Center Settings": "Pengaturan Pusat Monitoring",
    "Sign In": "Masuk",
    "Sign Up": "Daftar",
    "Password reset": "Reset Kata Sandi",
    "Error 404": "Error 404",
    "Error 500": "Error 500",
    // Breadcrumbs
    "Home": "Beranda",
    "Apps": "Aplikasi",
    "Site": "Situs",
    "Account": "Akun",
    "Organization": "Organisasi",
    "Team": "Tim",
    "Pages": "Halaman",
    "Profile": "Profil",
    "Wizard": "Panduan",
    "Layout": "Tata Letak",
    "Dashboards": "Dasbor",
    "Events & Alerts": "Kejadian & Peringatan",
    "Recording & Playback": "Rekaman & Putar Ulang",
    "Monitoring Center": "Pusat Monitoring",
    // Page titles
    selectOrganization: "Pilih Organisasi",
    loadingOrganizations: "Memuat organisasi...",
    selectAccount: "Pilih Akun",
    selectOrganizationFirst: "Pilih organisasi terlebih dahulu",
    loadingAccounts: "Memuat akun...",
    noAccounts: "Tidak ada akun tersedia",
    selectTeam: "Pilih Tim",
    selectAccountFirst: "Pilih akun terlebih dahulu",
    loadingTeams: "Memuat tim...",
    noTeams: "Tidak ada tim tersedia",
    sitesOverview: "Ringkasan Situs",
    totalSites: "Total Situs",
    activeSites: "Situs Aktif",
    totalVisitors: "Total Pengunjung",
    avgPerformance: "Rata-rata Kinerja",
    items: "Item:",
    searchSites: "Cari situs...",
    addSite: "Tambah Situs",
    manageSites: "Kelola situs",
    forYourTeam: "untuk tim Anda",
    manageSitesForTeam: "Kelola situs untuk tim {name}",
    editSite: "Ubah Situs",
    deleteSite: "Hapus Situs",
    createSite: "Buat Situs",
    updateSite: "Perbarui Situs",
    delete: "Hapus",
    deleteConfirmation: "Apakah Anda yakin ingin menghapus situs {name}?",
    actionCannotBeUndone: "Tindakan ini tidak dapat dikembalikan.",
    itemsPerPage: "Item per halaman:",
    previous: "Sebelumnya",
    next: "Berikutnya",
    showingEntries: "Menampilkan {from} hingga {to} dari {total} entri",
    retry: "Ulangi",
    retrying: "Mengulang...",
    loading: "Memuat...",
    errorLoadingData: "Gagal Memuat Data",
    noOrganizationSelected: "Belum Ada Organisasi Dipilih",
    selectOrgToViewAccounts: "Silakan pilih organisasi dari dropdown di atas untuk melihat akun pembayaran.",
    paymentAccountManagement: "Manajemen Akun Pembayaran",
    managePaymentAccountsForOrg: "Kelola akun pembayaran untuk {name}",
    noOrganizations: "Tidak ada organisasi tersedia",
    paymentAccountsOverview: "Ringkasan Akun Pembayaran",
    searchPaymentAccounts: "Cari akun pembayaran...",
    addPaymentAccount: "Tambah Akun Pembayaran",
    // organization view (id)
    totalOrganizations: "Total Organisasi",
    totalTeam: "Total Tim",
    totalUsers: "Total Pengguna",
    totalCameras: "Total Kamera",
    connectionError: "Koneksi Gagal",
    organizationsOverview: "Ringkasan Organisasi",
    searchOrganizations: "Cari organisasi...",
    noOrganizationsFound: "Tidak ada organisasi yang ditemukan",
    addOrganization: "Tambah Organisasi",
    editOrganization: "Ubah Organisasi",
    deleteOrganization: "Hapus Organisasi",
    createOrganization: "Buat Organisasi",
    updateOrganization: "Perbarui Organisasi",
    cancel: "Batal",
    active: "Aktif",
    inactive: "Tidak Aktif",
    organizationName: "Nama Organisasi",
    email: "Email",
    phone: "Telepon",
    country: "Negara",
    status: "Status",
    created: "Dibuat",
    actions: "Aksi",
    manageMembers: "Kelola Anggota",
    manageAccounts: "Kelola Akun",
    manageOrganization: "Kelola Organisasi",
    thisActionCannotBeUndone: "Tindakan ini tidak dapat dikembalikan.",
    teamManagement: "Manajemen Tim",
    manageTeamsForAccount: "Kelola tim untuk {name}",
    manageTeams: "Kelola tim",
    forYourAccount: "untuk akun Anda",
    teamsOverview: "Ringkasan Tim",
    searchTeams: "Cari tim...",
    addTeam: "Tambah Tim",
  },
};

mergeDeep(messages.en, { controlplane: { site: enControlplaneSite } });
mergeDeep(messages.id, { controlplane: { site: idControlplaneSite } });
mergeDeep(messages.en, { controlplane: { team: enControlplaneTeam } });
mergeDeep(messages.id, { controlplane: { team: idControlplaneTeam } });
mergeDeep(messages.en, { controlplane: { account: enControlplaneAccount } });
mergeDeep(messages.id, { controlplane: { account: idControlplaneAccount } });
mergeDeep(messages.en, { controlplane: { organization: enControlplaneOrganization } });
mergeDeep(messages.id, { controlplane: { organization: idControlplaneOrganization } });
mergeDeep(messages.en, { appsLiveView: enAppsLiveView });
mergeDeep(messages.id, { appsLiveView: idAppsLiveView });
mergeDeep(messages.en, { appsEventsAlerts: enAppsEventsAlerts });
mergeDeep(messages.id, { appsEventsAlerts: idAppsEventsAlerts });
mergeDeep(messages.en, { appsRecordingPlayback: enAppsRecordingPlayback });
mergeDeep(messages.id, { appsRecordingPlayback: idAppsRecordingPlayback });
mergeDeep(messages.en, { appsMonitoringCenter: enAppsMonitoringCenter });
mergeDeep(messages.id, { appsMonitoringCenter: idAppsMonitoringCenter });
mergeDeep(messages.en, { components: { membership: enComponentsMembership } });
mergeDeep(messages.id, { components: { membership: idComponentsMembership } });
mergeDeep(messages.en, { dashboard: enDashboard });
mergeDeep(messages.id, { dashboard: idDashboard });

const defaultLocale = readStoredLocale();

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: FALLBACK_LOCALE,
  globalInjection: true,
  messages,
});

applyLocaleToDocument(defaultLocale);

if (typeof window !== "undefined") {
  try {
    window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, defaultLocale);
  } catch (e) {
    // ignore storage access issues
  }
}

export const setAppLocale = (locale: AppLocale) => {
  if (i18n.global.locale.value !== locale) {
    i18n.global.locale.value = locale;
  }

  applyLocaleToDocument(locale);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale);
    } catch (e) {
      // ignore storage access issues
    }
  }
};

export const getCurrentLocale = (): AppLocale => {
  return i18n.global.locale.value as AppLocale;
};

export default i18n;
