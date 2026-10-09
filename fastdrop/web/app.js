
(() => {
  const ICONS = {
    bolt: `<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    sun: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    lock: `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    unlock: `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
    home: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    search: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    upload: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
    uploadFolder: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><polyline points="9 14 12 11 15 14"></polyline></svg>`,
    folderPlus: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>`,
    filePlus: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>`,
    clipboard: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
    zip: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`,
    list: `<svg class="svg-icon" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    grid: `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    folder: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    file: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`,
    fileText: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    fileCode: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    image: `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
    video: `<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    audio: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    download: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    edit: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    eye: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    tag: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
    trash: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    copy: `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    save: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
    check: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    x: `<svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    moreVertical: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.75"></circle><circle cx="12" cy="5" r="1.75"></circle><circle cx="12" cy="19" r="1.75"></circle></svg>`,
    plus: `<svg class="svg-icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  };

  const state = {
    currentPath: "",
    items: [],
    selectedPaths: new Set(),
    sortField: "name",
    sortAsc: true,
    viewMode: localStorage.getItem("fastdrop_view") || "list",
    auth: {
      required: false,
      isAuthorized: true,
      user: localStorage.getItem("fastdrop_user") || "",
      pass: localStorage.getItem("fastdrop_pass") || "",
      token: localStorage.getItem("fastdrop_token") || "",
    },
    editor: {
      path: "",
      name: "",
      originalContent: "",
      isDirty: false,
    },
    activeUploads: 0,
  };

  const el = {
    itemsList: document.getElementById("itemsList"),
    breadcrumbs: document.getElementById("breadcrumbs"),
    searchInput: document.getElementById("searchInput"),
    clearSearch: document.getElementById("clearSearch"),
    selectAllCheckbox: document.getElementById("selectAllCheckbox"),
    batchBar: document.getElementById("batchBar"),
    selectedCount: document.getElementById("selectedCount"),
    btnBatchDelete: document.getElementById("btnBatchDelete"),
    btnBatchClear: document.getElementById("btnBatchClear"),
    storageProgress: document.getElementById("storageProgress"),
    storageText: document.getElementById("storageText"),
    appVersion: document.getElementById("appVersion"),
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.getElementById("themeIcon"),
    authBtn: document.getElementById("authBtn"),
    authBtnText: document.getElementById("authBtnText"),
    authIcon: document.getElementById("authIcon"),
    brandIcon: document.getElementById("brandIcon"),
    homeIcon: document.getElementById("homeIcon"),
    searchIcon: document.getElementById("searchIcon"),
    viewList: document.getElementById("viewList"),
    viewGrid: document.getElementById("viewGrid"),
    explorerView: document.getElementById("explorerView"),

    btnUploadFiles: document.getElementById("btnUploadFiles"),
    btnUploadFolder: document.getElementById("btnUploadFolder"),
    btnNewFolder: document.getElementById("btnNewFolder"),
    btnNewFile: document.getElementById("btnNewFile"),
    btnQuickText: document.getElementById("btnQuickText"),
    btnDownloadZip: document.getElementById("btnDownloadZip"),
    fileInput: document.getElementById("fileInput"),
    folderInput: document.getElementById("folderInput"),

    iconUpload: document.getElementById("iconUpload"),
    iconUploadFolder: document.getElementById("iconUploadFolder"),
    iconNewFolder: document.getElementById("iconNewFolder"),
    iconNewFile: document.getElementById("iconNewFile"),
    iconQuickText: document.getElementById("iconQuickText"),
    iconZip: document.getElementById("iconZip"),
    dragOverlayIcon: document.getElementById("dragOverlayIcon"),

    dragOverlay: document.getElementById("dragOverlay"),
    uploadDrawer: document.getElementById("uploadDrawer"),
    uploadItems: document.getElementById("uploadItems"),
    uploadCount: document.getElementById("uploadCount"),
    closeUploadDrawer: document.getElementById("closeUploadDrawer"),

    clipboardModal: document.getElementById("clipboardModal"),
    clipboardHeaderIcon: document.getElementById("clipboardHeaderIcon"),
    clipboardTextarea: document.getElementById("clipboardTextarea"),
    clipboardStats: document.getElementById("clipboardStats"),
    clipboardSyncStatus: document.getElementById("clipboardSyncStatus"),
    btnClipboardClose: document.getElementById("btnClipboardClose"),
    btnClipboardClear: document.getElementById("btnClipboardClear"),
    btnClipboardCopy: document.getElementById("btnClipboardCopy"),
    btnClipboardCopyText: document.getElementById("btnClipboardCopyText"),
    btnClipboardSync: document.getElementById("btnClipboardSync"),
    btnClipboardSaveFile: document.getElementById("btnClipboardSaveFile"),
    iconClipCopy: document.getElementById("iconClipCopy"),
    iconClipSync: document.getElementById("iconClipSync"),
    iconClipSaveFile: document.getElementById("iconClipSaveFile"),

    promptModal: document.getElementById("promptModal"),
    promptTitle: document.getElementById("promptTitle"),
    promptDescription: document.getElementById("promptDescription"),
    promptInput: document.getElementById("promptInput"),
    promptForm: document.getElementById("promptForm"),
    btnPromptCancel: document.getElementById("btnPromptCancel"),
    btnPromptClose: document.getElementById("btnPromptClose"),

    editorModal: document.getElementById("editorModal"),
    editorFileName: document.getElementById("editorFileName"),
    editorFilePath: document.getElementById("editorFilePath"),
    editorFileIcon: document.getElementById("editorFileIcon"),
    editorSaveStatus: document.getElementById("editorSaveStatus"),
    editorGutter: document.getElementById("editorGutter"),
    editorTextarea: document.getElementById("editorTextarea"),
    editorHighlight: document.getElementById("editorHighlight"),
    editorCode: document.getElementById("editorCode"),
    editorStats: document.getElementById("editorStats"),
    btnEditorSave: document.getElementById("btnEditorSave"),
    btnEditorClose: document.getElementById("btnEditorClose"),
    btnEditorCopyText: document.getElementById("btnEditorCopyText"),
    iconEditorSave: document.getElementById("iconEditorSave"),
    iconEditorCopy: document.getElementById("iconEditorCopy"),

    previewModal: document.getElementById("previewModal"),
    previewTitle: document.getElementById("previewTitle"),
    previewBody: document.getElementById("previewBody"),
    previewDownloadBtn: document.getElementById("previewDownloadBtn"),
    btnPreviewClose: document.getElementById("btnPreviewClose"),

    authModal: document.getElementById("authModal"),
    authForm: document.getElementById("authForm"),
    authUsername: document.getElementById("authUsername"),
    authPassword: document.getElementById("authPassword"),
    authToken: document.getElementById("authToken"),
    authRemember: document.getElementById("authRemember"),
    btnAuthCancel: document.getElementById("btnAuthCancel"),
    btnAuthClose: document.getElementById("btnAuthClose"),
    tabBasic: document.getElementById("tabBasic"),
    tabToken: document.getElementById("tabToken"),

    toastContainer: document.getElementById("toastContainer"),
    metaThemeColor: document.getElementById("metaThemeColor"),

    headerQuickTextBtn: document.getElementById("headerQuickTextBtn"),
    headerQuickTextIcon: document.getElementById("headerQuickTextIcon"),
    fabContainer: document.getElementById("fabContainer"),
    fabBackdrop: document.getElementById("fabBackdrop"),
    fabSpeedDial: document.getElementById("fabSpeedDial"),
    fabMainBtn: document.getElementById("fabMainBtn"),
    fabMainIcon: document.getElementById("fabMainIcon"),
    fabBtnUpload: document.getElementById("fabBtnUpload"),
    fabBtnUploadFolder: document.getElementById("fabBtnUploadFolder"),
    fabBtnNewFolder: document.getElementById("fabBtnNewFolder"),
    fabBtnNewFile: document.getElementById("fabBtnNewFile"),
    fabBtnQuickText: document.getElementById("fabBtnQuickText"),
    fabIconUpload: document.getElementById("fabIconUpload"),
    fabIconUploadFolder: document.getElementById("fabIconUploadFolder"),
    fabIconNewFolder: document.getElementById("fabIconNewFolder"),
    fabIconNewFile: document.getElementById("fabIconNewFile"),
    fabIconQuickText: document.getElementById("fabIconQuickText"),

    bottomSheetBackdrop: document.getElementById("bottomSheetBackdrop"),
    actionBottomSheet: document.getElementById("actionBottomSheet"),
    sheetItemIcon: document.getElementById("sheetItemIcon"),
    sheetItemName: document.getElementById("sheetItemName"),
    sheetItemMeta: document.getElementById("sheetItemMeta"),
    btnBottomSheetClose: document.getElementById("btnBottomSheetClose"),
    sheetActionsContainer: document.getElementById("sheetActionsContainer"),
  };

  function injectStaticIcons() {
    el.brandIcon.innerHTML = ICONS.bolt;
    el.homeIcon.innerHTML = ICONS.home;
    el.searchIcon.innerHTML = ICONS.search;
    el.iconUpload.innerHTML = ICONS.upload;
    el.iconUploadFolder.innerHTML = ICONS.uploadFolder;
    el.iconNewFolder.innerHTML = ICONS.folderPlus;
    el.iconNewFile.innerHTML = ICONS.filePlus;
    el.iconQuickText.innerHTML = ICONS.clipboard;
    el.iconZip.innerHTML = ICONS.zip;
    el.viewList.innerHTML = ICONS.list;
    el.viewGrid.innerHTML = ICONS.grid;
    el.dragOverlayIcon.innerHTML = ICONS.upload;
    el.clipboardHeaderIcon.innerHTML = ICONS.clipboard;
    el.iconClipCopy.innerHTML = ICONS.copy;
    el.iconClipSync.innerHTML = ICONS.save;
    el.iconClipSaveFile.innerHTML = ICONS.filePlus;
    el.iconEditorSave.innerHTML = ICONS.save;
    el.iconEditorCopy.innerHTML = ICONS.copy;

    if (el.headerQuickTextIcon) el.headerQuickTextIcon.innerHTML = ICONS.clipboard;
    if (el.fabMainIcon) el.fabMainIcon.innerHTML = ICONS.plus;
    if (el.fabIconUpload) el.fabIconUpload.innerHTML = ICONS.upload;
    if (el.fabIconUploadFolder) el.fabIconUploadFolder.innerHTML = ICONS.uploadFolder;
    if (el.fabIconNewFolder) el.fabIconNewFolder.innerHTML = ICONS.folderPlus;
    if (el.fabIconNewFile) el.fabIconNewFile.innerHTML = ICONS.filePlus;
    if (el.fabIconQuickText) el.fabIconQuickText.innerHTML = ICONS.clipboard;
  }

  function toast(message, type = "info") {
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.textContent = message;
    el.toastContainer.appendChild(t);
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transition = "opacity 0.3s ease";
      setTimeout(() => t.remove(), 300);
    }, 3200);
  }

  function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i > 1 ? 2 : 0) + " " + units[i];
  }

  function formatDate(timestamp) {
    if (!timestamp) return "-";
    const d = new Date(timestamp * 1000);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getFileVectorIcon(isDir, ext) {
    if (isDir) return ICONS.folder;
    const e = (ext || "").toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "svg", "webp", "ico", "bmp"].includes(e)) return ICONS.image;
    if (["mp4", "mkv", "webm", "avi", "mov"].includes(e)) return ICONS.video;
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(e)) return ICONS.audio;
    if (["zip", "tar", "gz", "rar", "7z", "bz2"].includes(e)) return ICONS.zip;
    if (["py", "js", "ts", "html", "css", "json", "toml", "yml", "yaml", "sh", "sql", "c", "cpp", "rs", "go"].includes(e)) return ICONS.fileCode;
    if (["md", "txt", "log", "env", "ini"].includes(e)) return ICONS.fileText;
    return ICONS.file;
  }

  async function apiFetch(url, options = {}) {
    options.headers = options.headers || {};

    if (state.auth.token) {
      options.headers["Authorization"] = `Bearer ${state.auth.token}`;
    } else if (state.auth.user && state.auth.pass) {
      const creds = btoa(`${state.auth.user}:${state.auth.pass}`);
      options.headers["Authorization"] = `Basic ${creds}`;
    }

    try {
      const res = await fetch(url, options);
      if (res.status === 401) {
        showAuthModal();
        throw new Error("Authentication required");
      }
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function checkServerStatus() {
    try {
      const res = await apiFetch("/api/status");
      const data = await res.json();
      state.auth.required = data.auth_required;
      state.auth.isAuthorized = data.is_authorized;

      if (data.version) {
        el.appVersion.textContent = `v${data.version}`;
      }

      if (state.auth.required) {
        el.authBtn.style.display = "inline-flex";
        el.authBtnText.textContent = state.auth.isAuthorized ? "Logout" : "Login";
        el.authIcon.innerHTML = state.auth.isAuthorized ? ICONS.unlock : ICONS.lock;
      } else {
        el.authBtn.style.display = "none";
      }

      if (data.readonly) {
        el.btnUploadFiles.style.display = "none";
        el.btnUploadFolder.style.display = "none";
        el.btnNewFolder.style.display = "none";
        el.btnNewFile.style.display = "none";
      }
    } catch (e) {
      console.warn("Status check failed", e);
    }
  }

  async function loadDirectory(path = "") {
    el.itemsList.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading files...</p>
      </div>
    `;

    try {
      const res = await apiFetch(`/api/list?path=${encodeURIComponent(path)}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      state.currentPath = data.current_path || "";
      state.items = data.items || [];
      state.selectedPaths.clear();
      updateBatchBar();

      renderBreadcrumbs(data.breadcrumbs || []);
      renderStorage(data.storage);
      renderItems();

      window.location.hash = state.currentPath ? `#/${state.currentPath}` : "#/";
    } catch (err) {
      el.itemsList.innerHTML = `
        <div class="empty-state">
          <p style="color: var(--danger)">Error: ${escapeHtml(err.message)}</p>
          <button class="btn btn-secondary" onclick="window.fastDrop.loadDirectory('')">Return to Home</button>
        </div>
      `;
    }
  }

  function renderBreadcrumbs(crumbs) {
    el.breadcrumbs.innerHTML = "";

    const homeBtn = document.createElement("button");
    homeBtn.className = `breadcrumb-item ${state.currentPath === "" ? "active" : ""}`;
    homeBtn.innerHTML = `<span class="icon">${ICONS.home}</span> <span>Home</span>`;
    homeBtn.onclick = () => loadDirectory("");
    el.breadcrumbs.appendChild(homeBtn);

    crumbs.forEach((crumb, idx) => {
      const sep = document.createElement("span");
      sep.className = "breadcrumb-sep";
      sep.textContent = "/";
      el.breadcrumbs.appendChild(sep);

      const btn = document.createElement("button");
      btn.className = `breadcrumb-item ${idx === crumbs.length - 1 ? "active" : ""}`;
      btn.textContent = crumb.name;
      btn.onclick = () => loadDirectory(crumb.path);
      el.breadcrumbs.appendChild(btn);
    });
  }

  function renderStorage(storage) {
    if (!storage || !storage.total) {
      el.storageText.textContent = `${state.items.length} items`;
      el.storageProgress.style.width = "0%";
      return;
    }

    const freeStr = formatSize(storage.free);
    const totalStr = formatSize(storage.total);
    const usedPercent = Math.round((storage.used / storage.total) * 100);

    el.storageProgress.style.width = `${usedPercent}%`;
    el.storageText.textContent = `${freeStr} free of ${totalStr}`;
  }

  function getFilteredAndSortedItems() {
    const query = el.searchInput.value.trim().toLowerCase();
    let filtered = state.items;

    if (query) {
      filtered = filtered.filter(i => i.name.toLowerCase().includes(query));
    }

    filtered.sort((a, b) => {
      if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1;
      let valA = a[state.sortField];
      let valB = b[state.sortField];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return state.sortAsc ? -1 : 1;
      if (valA > valB) return state.sortAsc ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  function renderItems() {
    const items = getFilteredAndSortedItems();

    if (items.length === 0) {
      el.itemsList.innerHTML = `
        <div class="empty-state">
          <p>This folder is empty</p>
          <span class="subtext">Drop files here or click Upload to get started</span>
        </div>
      `;
      el.selectAllCheckbox.checked = false;
      return;
    }

    el.itemsList.innerHTML = "";

    items.forEach(item => {
      const row = document.createElement("div");
      row.className = `item-row ${item.is_dir ? "is-dir" : ""} ${state.selectedPaths.has(item.path) ? "selected" : ""}`;

      const iconSvg = getFileVectorIcon(item.is_dir, item.extension);
      const isEditable = !item.is_dir && isTextEditable(item.extension);
      const isPreviewable = !item.is_dir && isMediaPreviewable(item.extension);

      const metaFormatted = item.is_dir ? "Folder" : formatSize(item.size);
      const metaDateFormatted = formatDate(item.mtime);
      const metaMobileFull = `${metaFormatted} &bull; ${metaDateFormatted}`;

      row.innerHTML = `
        <div class="col-checkbox">
          <input type="checkbox" class="item-checkbox" data-path="${item.path}" ${state.selectedPaths.has(item.path) ? "checked" : ""}>
        </div>
        <div class="item-main" title="${escapeHtml(item.name)}">
          <span class="item-icon">${iconSvg}</span>
          <div class="item-details">
            <span class="item-name">${escapeHtml(item.name)}</span>
            <span class="item-mobile-meta">${metaMobileFull}</span>
          </div>
        </div>
        <div class="col-size item-meta">${item.is_dir ? "-" : formatSize(item.size)}</div>
        <div class="col-date item-meta">${metaDateFormatted}</div>
        <div class="item-actions">
          ${!item.is_dir ? `<button class="action-icon-btn btn-download" title="Download">${ICONS.download}</button>` : ""}
          ${isEditable ? `<button class="action-icon-btn btn-copy-content" title="Copy Text Content">${ICONS.copy}</button>` : ""}
          ${isEditable ? `<button class="action-icon-btn btn-edit" title="Edit in Editor">${ICONS.edit}</button>` : ""}
          ${isPreviewable ? `<button class="action-icon-btn btn-preview" title="Preview">${ICONS.eye}</button>` : ""}
          <button class="action-icon-btn btn-rename" title="Rename">${ICONS.tag}</button>
          <button class="action-icon-btn delete btn-delete" title="Delete">${ICONS.trash}</button>
        </div>
        <div class="item-mobile-actions">
          <button class="mobile-more-btn" title="More options" aria-label="More options" type="button">${ICONS.moreVertical}</button>
        </div>
      `;

      const cb = row.querySelector(".item-checkbox");
      cb.onclick = (e) => {
        e.stopPropagation();
        toggleSelect(item.path, cb.checked);
      };

      const main = row.querySelector(".item-main");
      main.onclick = () => {
        if (item.is_dir) {
          loadDirectory(item.path);
        } else if (isEditable) {
          openCodeEditor(item.path, item.name);
        } else if (isPreviewable) {
          openPreview(item.path, item.name, item.extension);
        } else {
          downloadFile(item.path);
        }
      };

      const btnDl = row.querySelector(".btn-download");
      if (btnDl) btnDl.onclick = (e) => { e.stopPropagation(); downloadFile(item.path); };

      const btnCopy = row.querySelector(".btn-copy-content");
      if (btnCopy) btnCopy.onclick = (e) => { e.stopPropagation(); copyFileContent(item.path, item.name); };

      const btnEd = row.querySelector(".btn-edit");
      if (btnEd) btnEd.onclick = (e) => { e.stopPropagation(); openCodeEditor(item.path, item.name); };

      const btnPv = row.querySelector(".btn-preview");
      if (btnPv) btnPv.onclick = (e) => { e.stopPropagation(); openPreview(item.path, item.name, item.extension); };

      const btnRn = row.querySelector(".btn-rename");
      if (btnRn) btnRn.onclick = (e) => { e.stopPropagation(); promptRename(item.path, item.name); };

      const btnDel = row.querySelector(".btn-delete");
      if (btnDel) btnDel.onclick = (e) => { e.stopPropagation(); promptDelete(item.path, item.name); };

      const btnMore = row.querySelector(".mobile-more-btn");
      if (btnMore) {
        btnMore.onclick = (e) => {
          e.stopPropagation();
          openItemBottomSheet(item);
        };
      }

      el.itemsList.appendChild(row);
    });

    updateSelectAllCheckbox();
  }

  function openItemBottomSheet(item) {
    if (!el.bottomSheetBackdrop) return;
    const isEditable = !item.is_dir && isTextEditable(item.extension);
    const isPreviewable = !item.is_dir && isMediaPreviewable(item.extension);
    const iconSvg = getFileVectorIcon(item.is_dir, item.extension);
    const metaFormatted = item.is_dir ? "Folder" : formatSize(item.size);
    const metaDateFormatted = formatDate(item.mtime);
    const metaMobileFull = `${metaFormatted} &bull; ${metaDateFormatted}`;

    el.sheetItemIcon.innerHTML = iconSvg;
    el.sheetItemName.textContent = item.name;
    el.sheetItemMeta.innerHTML = metaMobileFull;

    el.sheetActionsContainer.innerHTML = "";

    const actions = [];

    if (item.is_dir) {
      actions.push({
        label: "Open Folder",
        icon: ICONS.folder,
        handler: () => loadDirectory(item.path),
      });
    } else {
      actions.push({
        label: "Download File",
        icon: ICONS.download,
        handler: () => downloadFile(item.path),
      });
    }

    if (isEditable) {
      actions.push({
        label: "Copy Text Content",
        icon: ICONS.copy,
        handler: () => copyFileContent(item.path, item.name),
      });
      actions.push({
        label: "Edit in Code Editor",
        icon: ICONS.edit,
        handler: () => openCodeEditor(item.path, item.name),
      });
    }

    if (isPreviewable) {
      actions.push({
        label: "Preview",
        icon: ICONS.eye,
        handler: () => openPreview(item.path, item.name, item.extension),
      });
    }

    actions.push({
      label: "Rename",
      icon: ICONS.tag,
      handler: () => promptRename(item.path, item.name),
    });

    actions.push({
      label: "Delete",
      icon: ICONS.trash,
      danger: true,
      handler: () => promptDelete(item.path, item.name),
    });

    actions.forEach(act => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `sheet-action-row ${act.danger ? "danger" : ""}`;
      btn.innerHTML = `
        <span class="sheet-action-icon">${act.icon}</span>
        <span class="sheet-action-label">${escapeHtml(act.label)}</span>
      `;
      btn.onclick = () => {
        closeItemBottomSheet();
        act.handler();
      };
      el.sheetActionsContainer.appendChild(btn);
    });

    el.bottomSheetBackdrop.style.display = "flex";
    requestAnimationFrame(() => {
      el.bottomSheetBackdrop.classList.add("open");
    });
  }

  function closeItemBottomSheet() {
    if (!el.bottomSheetBackdrop) return;
    el.bottomSheetBackdrop.classList.remove("open");
    setTimeout(() => {
      el.bottomSheetBackdrop.style.display = "none";
    }, 240);
  }

  function isTextEditable(ext) {
    const editExts = [
      "txt", "py", "js", "ts", "json", "html", "css", "md", "toml", "yaml", "yml",
      "sh", "bat", "ps1", "sql", "env", "ini", "xml", "csv", "c", "cpp", "h", "rs", "go", "php", "java"
    ];
    return editExts.includes((ext || "").toLowerCase());
  }

  function isMediaPreviewable(ext) {
    const prevExts = ["png", "jpg", "jpeg", "gif", "webp", "svg", "mp4", "webm", "mp3", "wav", "ogg", "pdf"];
    return prevExts.includes((ext || "").toLowerCase());
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function toggleSelect(path, isSelected) {
    if (isSelected) state.selectedPaths.add(path);
    else state.selectedPaths.delete(path);
    updateBatchBar();
    updateSelectAllCheckbox();
    updateRowSelectedStyles();
  }

  function updateRowSelectedStyles() {
    document.querySelectorAll(".item-row").forEach(r => {
      const cb = r.querySelector(".item-checkbox");
      if (cb) {
        r.classList.toggle("selected", state.selectedPaths.has(cb.dataset.path));
      }
    });
  }

  function updateSelectAllCheckbox() {
    const visible = getFilteredAndSortedItems();
    if (visible.length === 0) {
      el.selectAllCheckbox.checked = false;
      return;
    }
    el.selectAllCheckbox.checked = visible.every(i => state.selectedPaths.has(i.path));
  }

  function updateBatchBar() {
    const count = state.selectedPaths.size;
    if (count > 0) {
      el.batchBar.style.display = "flex";
      el.selectedCount.textContent = `${count} item${count > 1 ? "s" : ""} selected`;
    } else {
      el.batchBar.style.display = "none";
    }
  }

  function downloadFile(relPath) {
    const url = `/api/raw?path=${encodeURIComponent(relPath)}&download=1`;
    window.open(url, "_blank");
  }

  async function copyFileContent(relPath, name) {
    try {
      const res = await apiFetch(`/api/file-content?path=${encodeURIComponent(relPath)}`);
      if (!res.ok) throw new Error("Could not read file");
      const data = await res.json();
      await navigator.clipboard.writeText(data.content || "");
      toast(`Copied content of ${name} to clipboard`, "success");
    } catch (err) {
      toast(`Copy failed: ${err.message}`, "error");
    }
  }

  let promptCallback = null;

  function showPrompt(title, desc, initialVal, onConfirm) {
    el.promptTitle.textContent = title;
    el.promptDescription.textContent = desc;
    el.promptInput.value = initialVal || "";
    el.promptModal.style.display = "flex";
    el.promptInput.focus();
    el.promptInput.select();
    promptCallback = onConfirm;
  }

  function closePrompt() {
    el.promptModal.style.display = "none";
    promptCallback = null;
  }

  el.promptForm.onsubmit = (e) => {
    e.preventDefault();
    const val = el.promptInput.value.trim();
    if (val && promptCallback) {
      promptCallback(val);
    }
    closePrompt();
  };
  el.btnPromptCancel.onclick = closePrompt;
  el.btnPromptClose.onclick = closePrompt;

  function promptNewFolder() {
    showPrompt("Create New Folder", "Enter folder name:", "New Folder", async (name) => {
      try {
        const res = await apiFetch("/api/mkdir", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: state.currentPath, name })
        });
        const data = await res.json();
        if (data.success) {
          toast(`Folder '${name}' created`, "success");
          loadDirectory(state.currentPath);
        } else {
          toast(data.error || "Failed to create folder", "error");
        }
      } catch (err) {
        toast(err.message, "error");
      }
    });
  }

  function promptNewFile() {
    showPrompt("Create New File", "Enter file name (e.g. script.py, notes.txt):", "untitled.txt", (name) => {
      const fullRel = state.currentPath ? `${state.currentPath}/${name}` : name;
      openCodeEditor(fullRel, name, "");
    });
  }

  function promptRename(oldPath, oldName) {
    showPrompt("Rename Item", "Enter new name:", oldName, async (newName) => {
      if (newName === oldName) return;
      try {
        const res = await apiFetch("/api/rename", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: oldPath, new_name: newName })
        });
        const data = await res.json();
        if (data.success) {
          toast(`Renamed to '${newName}'`, "success");
          loadDirectory(state.currentPath);
        } else {
          toast(data.error || "Failed to rename", "error");
        }
      } catch (err) {
        toast(err.message, "error");
      }
    });
  }

  async function promptDelete(path, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await apiFetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path })
      });
      const data = await res.json();
      if (data.success) {
        toast(`Deleted "${name}"`, "info");
        loadDirectory(state.currentPath);
      } else {
        toast(data.error || "Failed to delete", "error");
      }
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function batchDelete() {
    const count = state.selectedPaths.size;
    if (count === 0) return;
    if (!confirm(`Delete ${count} selected item(s)?`)) return;

    try {
      const res = await apiFetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: Array.from(state.selectedPaths) })
      });
      const data = await res.json();
      if (data.success) {
        toast(`Deleted ${data.deleted.length} item(s)`, "info");
        state.selectedPaths.clear();
        loadDirectory(state.currentPath);
      } else {
        toast(data.error || "Failed to delete items", "error");
      }
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function openClipboardModal() {
    el.clipboardModal.style.display = "flex";
    el.clipboardSyncStatus.textContent = "Loading shared text...";

    try {
      const res = await apiFetch("/api/clipboard");
      if (res.ok) {
        const data = await res.json();
        el.clipboardTextarea.value = data.text || "";
        el.clipboardSyncStatus.textContent = data.text ? "Synced with server" : "Ready";
      }
    } catch (e) {
      el.clipboardSyncStatus.textContent = "Offline / Local buffer";
    }

    updateClipboardStats();
    el.clipboardTextarea.focus();
  }

  function updateClipboardStats() {
    const text = el.clipboardTextarea.value;
    const chars = text.length;
    const lines = text ? (text.match(/\n/g) || []).length + 1 : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    el.clipboardStats.textContent = `${chars} chars | ${words} words | ${lines} lines`;
  }

  el.clipboardTextarea.addEventListener("input", () => {
    updateClipboardStats();
    el.clipboardSyncStatus.textContent = "Unsaved changes";
  });

  el.btnClipboardCopy.onclick = async () => {
    const text = el.clipboardTextarea.value;
    if (!text) {
      toast("Nothing to copy", "info");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      el.btnClipboardCopyText.textContent = "Copied!";
      toast("Copied text to clipboard!", "success");
      setTimeout(() => {
        el.btnClipboardCopyText.textContent = "Copy to Clipboard";
      }, 2000);
    } catch (err) {
      toast("Failed to copy to clipboard", "error");
    }
  };

  el.btnClipboardSync.onclick = async () => {
    const text = el.clipboardTextarea.value;
    el.btnClipboardSync.disabled = true;
    try {
      const res = await apiFetch("/api/clipboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success) {
        el.clipboardSyncStatus.textContent = "Synced with server";
        toast("Saved and shared text across devices!", "success");
      }
    } catch (err) {
      toast(`Sync failed: ${err.message}`, "error");
    } finally {
      el.btnClipboardSync.disabled = false;
    }
  };

  el.btnClipboardSaveFile.onclick = () => {
    const text = el.clipboardTextarea.value;
    if (!text) {
      toast("Text is empty", "info");
      return;
    }
    showPrompt("Save as File", "Enter filename for this text:", "snippet.txt", async (filename) => {
      const fullRel = state.currentPath ? `${state.currentPath}/${filename}` : filename;
      try {
        const res = await apiFetch("/api/file-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: fullRel, content: text })
        });
        const data = await res.json();
        if (data.success) {
          toast(`Saved as '${filename}'`, "success");
          loadDirectory(state.currentPath);
          el.clipboardModal.style.display = "none";
        }
      } catch (err) {
        toast(err.message, "error");
      }
    });
  };

  el.btnClipboardClear.onclick = () => {
    if (el.clipboardTextarea.value && confirm("Clear text?")) {
      el.clipboardTextarea.value = "";
      updateClipboardStats();
      el.clipboardSyncStatus.textContent = "Cleared";
    }
  };

  el.btnClipboardClose.onclick = () => {
    el.clipboardModal.style.display = "none";
  };
  el.btnQuickText.onclick = openClipboardModal;

  function highlightCode(code, ext) {
    if (!code) return "&nbsp;\n";
    const e = (ext || "").toLowerCase();

    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (e === "py") {
      escaped = escaped.replace(/(#[^\r\n]*)/g, '<span class="hl-comment">$1</span>');
      escaped = escaped.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '<span class="hl-string">$1</span>');
      escaped = escaped.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="hl-number">$1</span>');
      escaped = escaped.replace(/\b(def|class)\s+([a-zA-Z_]\w*)/g, '<span class="hl-keyword">$1</span> <span class="hl-func">$2</span>');
      escaped = escaped.replace(/(@[a-zA-Z_]\w*)/g, '<span class="hl-builtin">$1</span>');
      const pyKeywords = /\b(def|class|return|if|elif|else|while|for|in|try|except|finally|import|from|as|with|pass|break|continue|lambda|yield|async|await|assert|raise|global|nonlocal|del|is|not|and|or|True|False|None)\b/g;
      escaped = escaped.replace(pyKeywords, '<span class="hl-keyword">$1</span>');
      const pyBuiltins = /\b(print|len|range|self|cls|int|str|float|bool|list|dict|set|tuple|open|type|isinstance|sum|min|max|any|all|enumerate|zip|filter|map|sorted)\b/g;
      escaped = escaped.replace(pyBuiltins, '<span class="hl-builtin">$1</span>');
      escaped = escaped.replace(/([{}()\[\]])/g, '<span class="hl-bracket">$1</span>');
      return escaped + "\n";
    }

    if (["js", "ts", "json"].includes(e)) {
      escaped = escaped.replace(/(\/\/[^\r\n]*|\/\*[\s\S]*?\*\/)/g, '<span class="hl-comment">$1</span>');
      escaped = escaped.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, '<span class="hl-string">$1</span>');
      escaped = escaped.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="hl-number">$1</span>');
      escaped = escaped.replace(/\b(function)\s+([a-zA-Z_]\w*)/g, '<span class="hl-keyword">$1</span> <span class="hl-func">$2</span>');
      const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|this|class|extends|import|export|from|default|async|await|try|catch|finally|typeof|instanceof|true|false|null|undefined)\b/g;
      escaped = escaped.replace(jsKeywords, '<span class="hl-keyword">$1</span>');
      const jsBuiltins = /\b(console|document|window|Math|JSON|Promise|Array|Object|String|Number|Boolean|Date|RegExp|Set|Map)\b/g;
      escaped = escaped.replace(jsBuiltins, '<span class="hl-builtin">$1</span>');
      escaped = escaped.replace(/([{}()\[\]])/g, '<span class="hl-bracket">$1</span>');
      return escaped + "\n";
    }

    if (["html", "xml", "svg"].includes(e)) {
      escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-comment">$1</span>');
      escaped = escaped.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '<span class="hl-string">$1</span>');
      escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9\-]+)/g, '<span class="hl-tag">$1</span>');
      escaped = escaped.replace(/\b([a-zA-Z\-]+)=/g, '<span class="hl-attr">$1</span>=');
      escaped = escaped.replace(/(&gt;)/g, '<span class="hl-tag">$1</span>');
      return escaped + "\n";
    }

    if (e === "css") {
      escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-comment">$1</span>');
      escaped = escaped.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '<span class="hl-string">$1</span>');
      escaped = escaped.replace(/([a-zA-Z\-]+)\s*:/g, '<span class="hl-attr">$1</span>:');
      escaped = escaped.replace(/\b(\d+(?:px|rem|em|%|vh|vw|s|ms)?)\b/g, '<span class="hl-number">$1</span>');
      escaped = escaped.replace(/([{}()])/g, '<span class="hl-bracket">$1</span>');
      return escaped + "\n";
    }

    if (["sh", "bash", "zsh", "ps1"].includes(e)) {
      escaped = escaped.replace(/(#[^\r\n]*)/g, '<span class="hl-comment">$1</span>');
      escaped = escaped.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '<span class="hl-string">$1</span>');
      escaped = escaped.replace(/(\$[a-zA-Z0-9_]+)/g, '<span class="hl-var">$1</span>');
      escaped = escaped.replace(/\b(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|chmod|chown|sudo|exit|source|if|then|else|fi|for|do|done|while|case|esac)\b/g, '<span class="hl-keyword">$1</span>');
      return escaped + "\n";
    }

    escaped = escaped.replace(/(#[^\r\n]*|\/\/[^\r\n]*)/g, '<span class="hl-comment">$1</span>');
    escaped = escaped.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '<span class="hl-string">$1</span>');
    escaped = escaped.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="hl-number">$1</span>');
    escaped = escaped.replace(/([{}()\[\]])/g, '<span class="hl-bracket">$1</span>');
    return escaped + "\n";
  }

  async function openCodeEditor(relPath, name, initialContent = null) {
    state.editor.path = relPath;
    state.editor.name = name;
    el.editorFileName.textContent = name;
    el.editorFilePath.textContent = "/" + relPath;
    el.editorFileIcon.innerHTML = getFileVectorIcon(false, name.split(".").pop());

    if (initialContent !== null) {
      state.editor.originalContent = initialContent;
      el.editorTextarea.value = initialContent;
      updateEditorView();
      el.editorModal.style.display = "flex";
      return;
    }

    try {
      const res = await apiFetch(`/api/file-content?path=${encodeURIComponent(relPath)}`);
      if (!res.ok) throw new Error("Failed to load file content");
      const data = await res.json();
      state.editor.originalContent = data.content || "";
      el.editorTextarea.value = state.editor.originalContent;
      state.editor.isDirty = false;
      el.editorSaveStatus.textContent = "Saved";
      el.editorSaveStatus.style.background = "var(--bg-surface-elevated)";
      updateEditorView();
      el.editorModal.style.display = "flex";
    } catch (err) {
      toast(err.message, "error");
    }
  }

  function updateGutter() {
    const lines = (el.editorTextarea.value.match(/\n/g) || []).length + 1;
    let gutterText = "";
    for (let i = 1; i <= lines; i++) gutterText += i + "\n";
    el.editorGutter.textContent = gutterText;
  }

  function updateEditorStats() {
    const text = el.editorTextarea.value;
    const lines = (text.match(/\n/g) || []).length + 1;
    const chars = text.length;
    const bytes = new Blob([text]).size;
    el.editorStats.textContent = `Lines: ${lines} | Chars: ${chars} | Size: ${formatSize(bytes)}`;

    const isDirty = text !== state.editor.originalContent;
    state.editor.isDirty = isDirty;
    el.editorSaveStatus.textContent = isDirty ? "Unsaved Changes" : "Saved";
    el.editorSaveStatus.style.background = isDirty ? "var(--warning)" : "var(--bg-surface-elevated)";
  }

  function updateEditorView() {
    updateEditorStats();
    updateGutter();
    if (el.editorCode) {
      const ext = (state.editor.name.split(".").pop() || "");
      el.editorCode.innerHTML = highlightCode(el.editorTextarea.value, ext);
    }
  }

  async function saveEditorContent() {
    const content = el.editorTextarea.value;
    el.btnEditorSave.disabled = true;

    try {
      const res = await apiFetch("/api/file-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: state.editor.path,
          content: content
        })
      });
      const data = await res.json();
      if (data.success) {
        state.editor.originalContent = content;
        updateEditorView();
        toast(`Saved ${state.editor.name}`, "success");
        loadDirectory(state.currentPath);
      } else {
        toast(data.error || "Failed to save file", "error");
      }
    } catch (err) {
      toast(err.message, "error");
    } finally {
      el.btnEditorSave.disabled = false;
    }
  }

  el.btnEditorCopyText.onclick = async () => {
    try {
      await navigator.clipboard.writeText(el.editorTextarea.value);
      toast("File content copied to clipboard", "success");
    } catch (e) {
      toast("Failed to copy content", "error");
    }
  };

  function closeEditor() {
    if (state.editor.isDirty && !confirm("Discard unsaved changes?")) return;
    el.editorModal.style.display = "none";
  }

  el.editorTextarea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = el.editorTextarea.selectionStart;
      const end = el.editorTextarea.selectionEnd;
      el.editorTextarea.value = el.editorTextarea.value.substring(0, start) + "    " + el.editorTextarea.value.substring(end);
      el.editorTextarea.selectionStart = el.editorTextarea.selectionEnd = start + 4;
      updateEditorView();
    } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveEditorContent();
    } else if (e.key === "Escape") {
      closeEditor();
    }
  });

  el.editorTextarea.addEventListener("input", () => {
    updateEditorView();
  });

  el.editorTextarea.addEventListener("scroll", () => {
    el.editorGutter.scrollTop = el.editorTextarea.scrollTop;
    if (el.editorHighlight) {
      el.editorHighlight.scrollTop = el.editorTextarea.scrollTop;
      el.editorHighlight.scrollLeft = el.editorTextarea.scrollLeft;
    }
  });

  el.btnEditorSave.onclick = saveEditorContent;
  el.btnEditorClose.onclick = closeEditor;

  function openPreview(relPath, name, ext) {
    el.previewTitle.textContent = name;
    el.previewDownloadBtn.href = `/api/raw?path=${encodeURIComponent(relPath)}&download=1`;
    el.previewBody.innerHTML = "";

    const rawUrl = `/api/raw?path=${encodeURIComponent(relPath)}`;
    const e = ext.toLowerCase();

    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(e)) {
      const img = document.createElement("img");
      img.src = rawUrl;
      el.previewBody.appendChild(img);
    } else if (["mp4", "webm"].includes(e)) {
      const vid = document.createElement("video");
      vid.src = rawUrl;
      vid.controls = true;
      vid.autoplay = true;
      el.previewBody.appendChild(vid);
    } else if (["mp3", "wav", "ogg"].includes(e)) {
      const aud = document.createElement("audio");
      aud.src = rawUrl;
      aud.controls = true;
      aud.autoplay = true;
      el.previewBody.appendChild(aud);
    } else if (e === "pdf") {
      const frame = document.createElement("iframe");
      frame.src = rawUrl;
      frame.style.width = "100%";
      frame.style.height = "70vh";
      el.previewBody.appendChild(frame);
    }

    el.previewModal.style.display = "flex";
  }

  el.btnPreviewClose.onclick = () => {
    el.previewBody.innerHTML = "";
    el.previewModal.style.display = "none";
  };

  function uploadFile(file, relPath = "") {
    el.uploadDrawer.style.display = "flex";
    state.activeUploads++;
    el.uploadCount.textContent = state.activeUploads;

    const itemDiv = document.createElement("div");
    itemDiv.className = "upload-item";
    const filename = file.name;

    itemDiv.innerHTML = `
      <div class="upload-info">
        <span class="upload-name" title="${escapeHtml(filename)}">${escapeHtml(filename)}</span>
        <span class="upload-pct">0%</span>
      </div>
      <div class="upload-bar">
        <div class="upload-fill"></div>
      </div>
    `;
    el.uploadItems.prepend(itemDiv);

    const fill = itemDiv.querySelector(".upload-fill");
    const pct = itemDiv.querySelector(".upload-pct");

    const targetFolder = relPath || state.currentPath;
    const url = `/api/upload-stream?filename=${encodeURIComponent(filename)}&path=${encodeURIComponent(targetFolder)}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    if (state.auth.token) {
      xhr.setRequestHeader("Authorization", `Bearer ${state.auth.token}`);
    } else if (state.auth.user && state.auth.pass) {
      xhr.setRequestHeader("Authorization", `Basic ${btoa(`${state.auth.user}:${state.auth.pass}`)}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        fill.style.width = `${percent}%`;
        pct.textContent = `${percent}%`;
      }
    };

    xhr.onload = () => {
      state.activeUploads--;
      el.uploadCount.textContent = state.activeUploads;
      if (xhr.status >= 200 && xhr.status < 300) {
        fill.style.background = "var(--accent)";
        pct.textContent = "Done";
        toast(`Uploaded ${filename}`, "success");
        loadDirectory(state.currentPath);
      } else {
        fill.style.background = "var(--danger)";
        pct.textContent = "Failed";
        toast(`Failed to upload ${filename}`, "error");
      }
    };

    xhr.onerror = () => {
      state.activeUploads--;
      el.uploadCount.textContent = state.activeUploads;
      fill.style.background = "var(--danger)";
      pct.textContent = "Error";
      toast(`Upload error for ${filename}`, "error");
    };

    xhr.send(file);
  }

  let dragCounter = 0;
  window.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragCounter++;
    el.dragOverlay.classList.add("active");
  });

  window.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      el.dragOverlay.classList.remove("active");
    }
  });

  window.addEventListener("dragover", (e) => e.preventDefault());

  window.addEventListener("drop", async (e) => {
    e.preventDefault();
    dragCounter = 0;
    el.dragOverlay.classList.remove("active");

    const items = e.dataTransfer.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
      if (entry) traverseEntry(entry);
      else {
        const file = items[i].getAsFile();
        if (file) uploadFile(file);
      }
    }
  });

  function traverseEntry(entry, path = "") {
    if (entry.isFile) {
      entry.file(file => uploadFile(file, path));
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const newPath = path ? `${path}/${entry.name}` : entry.name;
      dirReader.readEntries(entries => {
        entries.forEach(sub => traverseEntry(sub, newPath));
      });
    }
  }

  function showAuthModal() {
    el.authModal.style.display = "flex";
  }

  function closeAuthModal() {
    el.authModal.style.display = "none";
  }

  el.btnAuthCancel.onclick = closeAuthModal;
  el.btnAuthClose.onclick = closeAuthModal;

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      if (tab.dataset.tab === "basic") {
        el.tabBasic.style.display = "flex";
        el.tabToken.style.display = "none";
      } else {
        el.tabBasic.style.display = "none";
        el.tabToken.style.display = "flex";
      }
    };
  });

  el.authForm.onsubmit = async (e) => {
    e.preventDefault();
    const isBasic = el.tabBasic.style.display !== "none";
    if (isBasic) {
      state.auth.user = el.authUsername.value.trim();
      state.auth.pass = el.authPassword.value.trim();
      state.auth.token = "";
    } else {
      state.auth.token = el.authToken.value.trim();
      state.auth.user = "";
      state.auth.pass = "";
    }

    if (el.authRemember.checked) {
      if (state.auth.token) {
        localStorage.setItem("fastdrop_token", state.auth.token);
      } else {
        localStorage.setItem("fastdrop_user", state.auth.user);
        localStorage.setItem("fastdrop_pass", state.auth.pass);
      }
    }

    closeAuthModal();
    checkServerStatus();
    loadDirectory(state.currentPath);
  };

  el.authBtn.onclick = () => {
    if (state.auth.isAuthorized) {
      localStorage.removeItem("fastdrop_user");
      localStorage.removeItem("fastdrop_pass");
      localStorage.removeItem("fastdrop_token");
      state.auth.user = "";
      state.auth.pass = "";
      state.auth.token = "";
      state.auth.isAuthorized = false;
      toast("Logged out", "info");
      checkServerStatus();
      loadDirectory(state.currentPath);
    } else {
      showAuthModal();
    }
  };

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem("fastdrop_theme", theme);
    el.themeIcon.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    if (el.metaThemeColor) {
      el.metaThemeColor.content = theme === "dark" ? "#0f1117" : "#f8fafc";
    }
  }

  el.themeToggle.onclick = () => {
    const current = document.body.dataset.theme;
    applyTheme(current === "dark" ? "light" : "dark");
  };

  let isFabOpen = false;

  function toggleFab() {
    if (isFabOpen) closeFab();
    else openFab();
  }

  function openFab() {
    isFabOpen = true;
    if (el.fabContainer) el.fabContainer.classList.add("open");
    if (el.fabBackdrop) {
      el.fabBackdrop.style.display = "block";
      requestAnimationFrame(() => el.fabBackdrop.classList.add("visible"));
    }
  }

  function closeFab() {
    isFabOpen = false;
    if (el.fabContainer) el.fabContainer.classList.remove("open");
    if (el.fabBackdrop) {
      el.fabBackdrop.classList.remove("visible");
      setTimeout(() => {
        if (!isFabOpen) el.fabBackdrop.style.display = "none";
      }, 200);
    }
  }

  if (el.fabMainBtn) el.fabMainBtn.onclick = toggleFab;
  if (el.fabBackdrop) el.fabBackdrop.onclick = closeFab;

  if (el.fabBtnUpload) {
    el.fabBtnUpload.onclick = () => {
      closeFab();
      el.fileInput.click();
    };
  }
  if (el.fabBtnUploadFolder) {
    el.fabBtnUploadFolder.onclick = () => {
      closeFab();
      el.folderInput.click();
    };
  }
  if (el.fabBtnNewFolder) {
    el.fabBtnNewFolder.onclick = () => {
      closeFab();
      promptNewFolder();
    };
  }
  if (el.fabBtnNewFile) {
    el.fabBtnNewFile.onclick = () => {
      closeFab();
      promptNewFile();
    };
  }
  if (el.fabBtnQuickText) {
    el.fabBtnQuickText.onclick = () => {
      closeFab();
      openClipboardModal();
    };
  }
  if (el.headerQuickTextBtn) {
    el.headerQuickTextBtn.onclick = openClipboardModal;
  }

  if (el.btnBottomSheetClose) el.btnBottomSheetClose.onclick = closeItemBottomSheet;
  if (el.bottomSheetBackdrop) {
    el.bottomSheetBackdrop.onclick = (e) => {
      if (e.target === el.bottomSheetBackdrop) closeItemBottomSheet();
    };
  }

  function setViewMode(mode) {
    state.viewMode = mode;
    localStorage.setItem("fastdrop_view", mode);
    el.explorerView.className = `explorer-view ${mode}-mode`;
    el.viewList.classList.toggle("active", mode === "list");
    el.viewGrid.classList.toggle("active", mode === "grid");
    renderItems();
  }

  el.viewList.onclick = () => setViewMode("list");
  el.viewGrid.onclick = () => setViewMode("grid");

  document.querySelectorAll(".sortable").forEach(header => {
    header.onclick = () => {
      const field = header.dataset.sort;
      if (state.sortField === field) {
        state.sortAsc = !state.sortAsc;
      } else {
        state.sortField = field;
        state.sortAsc = true;
      }
      document.querySelectorAll(".sortable .sort-indicator").forEach(ind => ind.textContent = "");
      header.querySelector(".sort-indicator").textContent = state.sortAsc ? " ↑" : " ↓";
      renderItems();
    };
  });

  el.searchInput.oninput = () => {
    const hasVal = Boolean(el.searchInput.value);
    el.clearSearch.style.display = hasVal ? "block" : "none";
    renderItems();
  };
  el.clearSearch.onclick = () => {
    el.searchInput.value = "";
    el.clearSearch.style.display = "none";
    renderItems();
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== el.searchInput && document.activeElement !== el.editorTextarea && document.activeElement !== el.clipboardTextarea) {
      e.preventDefault();
      el.searchInput.focus();
    }
  });

  el.btnUploadFiles.onclick = () => el.fileInput.click();
  el.btnUploadFolder.onclick = () => el.folderInput.click();
  el.fileInput.onchange = (e) => {
    Array.from(e.target.files).forEach(f => uploadFile(f));
    el.fileInput.value = "";
  };
  el.folderInput.onchange = (e) => {
    Array.from(e.target.files).forEach(f => {
      const rel = f.webkitRelativePath ? f.webkitRelativePath.split("/").slice(0, -1).join("/") : "";
      uploadFile(f, rel);
    });
    el.folderInput.value = "";
  };

  el.btnNewFolder.onclick = promptNewFolder;
  el.btnNewFile.onclick = promptNewFile;
  el.btnBatchDelete.onclick = batchDelete;
  el.btnBatchClear.onclick = () => {
    state.selectedPaths.clear();
    updateBatchBar();
    updateSelectAllCheckbox();
    updateRowSelectedStyles();
  };

  el.btnDownloadZip.onclick = () => {
    const url = `/api/zip?path=${encodeURIComponent(state.currentPath)}`;
    window.open(url, "_blank");
  };

  el.selectAllCheckbox.onchange = () => {
    const checked = el.selectAllCheckbox.checked;
    const items = getFilteredAndSortedItems();
    items.forEach(i => {
      if (checked) state.selectedPaths.add(i.path);
      else state.selectedPaths.delete(i.path);
    });
    updateBatchBar();
    updateRowSelectedStyles();
  };

  el.closeUploadDrawer.onclick = () => {
    el.uploadDrawer.style.display = "none";
  };

  window.onhashchange = () => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (hash !== state.currentPath) {
      loadDirectory(hash);
    }
  };

  window.FastDrop = window.fastDrop = { name: "FastDrop", loadDirectory };

  injectStaticIcons();
  const initialTheme = localStorage.getItem("fastdrop_theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  applyTheme(initialTheme);
  setViewMode(state.viewMode);
  checkServerStatus();

  const initialHash = window.location.hash.replace(/^#\/?/, "");
  loadDirectory(initialHash);
})();