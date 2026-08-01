(function () {
  "use strict";

  var kotaSelect = document.getElementById("kota-select");
  var areaSelect = document.getElementById("area-select");
  var results = document.getElementById("results");

  function formatRupiah(n) {
    if (n === null || n === undefined) return null;
    return "Rp" + n.toLocaleString("id-ID");
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values)).sort(function (a, b) {
      return a.localeCompare(b, "id");
    });
  }

  function getKotaList() {
    return uniqueSorted(CLUSTER_DATA.map(function (row) { return row.kota; }));
  }

  function getAreaList(kota) {
    return uniqueSorted(
      CLUSTER_DATA
        .filter(function (row) { return row.kota === kota; })
        .map(function (row) { return row.area; })
    );
  }

  function getEntries(kota, area) {
    return CLUSTER_DATA.filter(function (row) {
      return row.kota === kota && row.area === area;
    });
  }

  function populateSelect(select, options, placeholder) {
    select.innerHTML = "";
    var placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.textContent = placeholder;
    select.appendChild(placeholderOpt);
    options.forEach(function (opt) {
      var el = document.createElement("option");
      el.value = opt;
      el.textContent = opt;
      select.appendChild(el);
    });
  }

  function renderEmpty(message) {
    results.innerHTML = "";
    var div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = message;
    results.appendChild(div);
  }

  function renderResults(kota, area) {
    var entries = getEntries(kota, area);

    if (entries.length === 0) {
      renderEmpty("Belum ada data untuk area ini.");
      return;
    }

    results.innerHTML = "";

    var heading = document.createElement("div");
    heading.className = "area-heading";
    heading.innerHTML =
      "<span>" + area + "</span><span>" + entries.length + " lokasi</span>";
    results.appendChild(heading);

    entries.forEach(function (entry, i) {
      var row = document.createElement("div");
      row.className = "entry";

      var top = document.createElement("div");
      top.className = "entry-top";
      top.innerHTML =
        '<span class="entry-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="entry-name">' + entry.lokasi + "</span>";
      row.appendChild(top);

      if (entry.favorit && entry.favorit.length > 0) {
        var tagsWrap = document.createElement("div");
        tagsWrap.className = "tags-wrap";

        var tagLabel = document.createElement("div");
        tagLabel.className = "tags-label";
        tagLabel.textContent = "Tipe Favorit:";
        tagsWrap.appendChild(tagLabel);

        var tags = document.createElement("div");
        tags.className = "tags";
        entry.favorit.forEach(function (product) {
          var tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = product;
          tags.appendChild(tag);
        });
        tagsWrap.appendChild(tags);

        row.appendChild(tagsWrap);
      }

      var priceRow = document.createElement("div");
      priceRow.className = "price-row";
      var priceValue = formatRupiah(entry.harga);
      priceRow.innerHTML =
        '<span class="price-label">Estimasi Harga Jasa Pemasangan</span>' +
        '<span class="price-value' + (priceValue ? "" : " unknown") + '">' +
        (priceValue || "Belum ada data") +
        "</span>";
      row.appendChild(priceRow);

      results.appendChild(row);
    });
  }

  function onKotaChange() {
    var kota = kotaSelect.value;

    if (!kota) {
      areaSelect.disabled = true;
      populateSelect(areaSelect, [], "Pilih kota dulu");
      renderEmpty("Pilih kota dan area untuk melihat daftar lokasi.");
      return;
    }

    var areas = getAreaList(kota);
    areaSelect.disabled = false;
    populateSelect(areaSelect, areas, "— Pilih area —");
    renderEmpty("Pilih area untuk melihat daftar lokasi.");
  }

  function onAreaChange() {
    var kota = kotaSelect.value;
    var area = areaSelect.value;

    if (!kota || !area) {
      renderEmpty("Pilih area untuk melihat daftar lokasi.");
      return;
    }

    renderResults(kota, area);
  }

  function init() {
    populateSelect(kotaSelect, getKotaList(), "— Pilih kota —");
    areaSelect.disabled = true;
    populateSelect(areaSelect, [], "Pilih kota dulu");
    renderEmpty("Pilih kota dan area untuk melihat daftar lokasi.");

    kotaSelect.addEventListener("change", onKotaChange);
    areaSelect.addEventListener("change", onAreaChange);
  }

  document.addEventListener("DOMContentLoaded", init);
})();