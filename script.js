// Small behaviours for the demo. The tech lead replaces these with real saves.
document.querySelectorAll('[data-search]').forEach(function (box) {
  box.addEventListener('input', function () {
    var q = box.value.toLowerCase();
    document.querySelectorAll(box.dataset.search + ' tbody tr').forEach(function (r) {
      r.style.display = r.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none';
    });
  });
});
document.querySelectorAll('tr[data-review]').forEach(function (row) {
  var set = function (text, cls) {
    var pill = row.querySelector('.pill');
    pill.textContent = text; pill.className = 'pill ' + cls;
    row.querySelector('.actions').innerHTML = '<span class="small-muted">Done</span>';
  };
  var a = row.querySelector('[data-approve]'), r = row.querySelector('[data-reject]');
  if (a) a.onclick = function () { set('Verified', 'pill-ok'); };
  if (r) r.onclick = function () { set('Rejected', 'pill-bad'); };
});
