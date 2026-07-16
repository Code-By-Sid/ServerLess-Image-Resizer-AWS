  const API = "https://cj91u6ve5a.execute-api.ap-south-1.amazonaws.com/default/upload";

  const imageFile = document.getElementById("imageFile");
  const dropzone = document.getElementById("dropzone");
  const previewImage = document.getElementById("previewImage");
  const status = document.getElementById("status");
  const uploadBtn = document.getElementById("uploadBtn");

  const originalImage = document.getElementById("originalImage");
  const resizedImage = document.getElementById("resizedImage");
  const compare = document.getElementById("compare");
  const compareClip = document.getElementById("compareClip");
  const compareRange = document.getElementById("compareRange");
  const compareHandle = document.getElementById("compareHandle");

  const resultsEmpty = document.getElementById("resultsEmpty");
  const statsGrid = document.getElementById("statsGrid");
  const resultActions = document.getElementById("resultActions");

  let selectedQuality = "medium";

  /* ---------- Pixel grid hero animation ---------- */
  (function buildPixelGrid(){
    const grid = document.getElementById("pixelGrid");
    const colors = ["#0E7C66", "#FF6B4D", "#0B5E4C", "#E14F32", "#41504C"];
    for (let i = 0; i < 36; i++) {
      const px = document.createElement("div");
      px.className = "pixel";
      px.style.background = colors[Math.floor(Math.random() * colors.length)];
      px.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
      px.style.animationDuration = (4.5 + Math.random() * 2.5).toFixed(2) + "s";
      grid.appendChild(px);
    }
  })();

  /* ---------- Scroll reveal for steps ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.2 });
  document.querySelectorAll(".step").forEach(el => io.observe(el));

  /* ---------- Quality cards ---------- */
  document.querySelectorAll(".quality-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".quality-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedQuality = card.dataset.value;
    });
  });

  /* ---------- Dropzone ---------- */
  dropzone.addEventListener("click", () => imageFile.click());
  ["dragenter", "dragover"].forEach(evt =>
    dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add("dragover"); })
  );
  ["dragleave", "drop"].forEach(evt =>
    dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove("dragover"); })
  );
  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
      imageFile.files = e.dataTransfer.files;
      handlePreview(file);
    }
  });

  imageFile.addEventListener("change", function () {
    const file = imageFile.files[0];
    if (file) handlePreview(file);
  });

  function handlePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.classList.add("show");
    };
    reader.readAsDataURL(file);
    setStatus("idle", "Ready to upload " + file.name);
  }

  function setStatus(state, text) {
    status.className = "status-row" + (state !== "idle" ? " " + state : "");
    status.querySelector(".status-text").textContent = text;
  }

  /* ---------- Compare slider ---------- */
  function setClip(pct) {
    compareClip.style.width = pct + "%";
    compareHandle.style.left = pct + "%";
    resizedImage.style.width = (10000 / pct) + "%";
  }
  compareRange.addEventListener("input", () => setClip(compareRange.value));

  /* ---------- Upload ---------- */
  function uploadImage() {
    const file = imageFile.files[0];
    if (!file) {
      setStatus("error", "Please select an image first");
      return;
    }

    uploadBtn.disabled = true;
    setStatus("loading", "Uploading and resizing…");

    const reader = new FileReader();
    reader.onload = async function () {
      const base64 = reader.result;
      const body = { filename: file.name, resize: selectedQuality, image: base64 };

      try {
        const response = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();

        if (data.error) {
          setStatus("error", data.error);
          uploadBtn.disabled = false;
          return;
        }

        setStatus("success", "Image resized successfully");

        originalImage.src = data.originalImage;
        resizedImage.src = data.resizedImage;
        setClip(50);
        compareRange.value = 50;

        document.getElementById("fileName").textContent = data.fileName;
        document.getElementById("imageFormat").textContent = data.imageFormat;
        document.getElementById("quality").textContent = data.quality;
        document.getElementById("originalResolution").textContent = data.originalWidth + " × " + data.originalHeight;
        document.getElementById("resizedResolution").textContent = data.resizedWidth + " × " + data.resizedHeight;
        document.getElementById("originalSize").textContent = data.originalSizeKB + " KB";
        document.getElementById("resizedSize").textContent = data.resizedSizeKB + " KB";
        document.getElementById("savedSize").textContent = data.savedSizeKB + " KB";
        document.getElementById("compression").textContent = data.compressionPercentage + " %";
        document.getElementById("processingTime").textContent = data.processingTime;

        document.getElementById("downloadBtn").href = data.downloadURL;
        document.getElementById("viewBtn").href = data.resizedImage;

        resultsEmpty.style.display = "none";
        compare.classList.add("show");
        statsGrid.classList.add("show");
        resultActions.classList.add("show");

      } catch (error) {
        console.log(error);
        setStatus("error", "Upload failed — please try again");
      } finally {
        uploadBtn.disabled = false;
      }
    };
    reader.readAsDataURL(file);
  }

  /* ---------- Reset ---------- */
  function resetPage() {
    imageFile.value = "";
    previewImage.src = "";
    previewImage.classList.remove("show");
    setStatus("idle", "Waiting for an image");

    compare.classList.remove("show");
    statsGrid.classList.remove("show");
    resultActions.classList.remove("show");
    resultsEmpty.style.display = "flex";

    document.getElementById("downloadBtn").removeAttribute("href");
    document.getElementById("viewBtn").removeAttribute("href");
  }