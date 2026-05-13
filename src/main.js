// Ekstrak <style>, ext <script src>, dan <body> content
// agar aman di-inject via innerHTML (browser drop <head> jika nested)
function processToolHtml_(html) {
  // Ambil semua blok <style>
  var styleMatches = [];
  var styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  var m;
  while ((m = styleRe.exec(html)) !== null) {
    styleMatches.push(m[1]);
  }
  var styleBlock = styleMatches.length
    ? '<style>' + styleMatches.join('\n') + '</style>'
    : '';

  // Ambil semua external script src dari <head>
  var extSrcs = [];
  var headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    var headHtml = headMatch[1];
    var extRe = /<script[^>]+src=["']([^"']+)["'][^>]*>\s*<\/script>/gi;
    while ((m = extRe.exec(headHtml)) !== null) {
      extSrcs.push(m[1]);
    }
  }
  var extBlock = extSrcs.map(function(src) {
    return '<script src="' + src + '"></script>';
  }).join('\n');

  // Ambil konten <body>
  var bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  var bodyContent = bodyMatch ? bodyMatch[1].trim() : html;

  return styleBlock + '\n' + extBlock + '\n' + bodyContent;
}