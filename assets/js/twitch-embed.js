(function(){
  const iframe = document.querySelector('iframe[data-twitch-embed="player"]');
  if(!iframe) return;
  try{
    const host = window.location.hostname;
    const url = new URL(iframe.getAttribute('src'));
    url.searchParams.set('parent', host);
    iframe.setAttribute('src', url.toString());
  }catch(e){}
})();
