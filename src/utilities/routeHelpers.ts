const getBaseName = (pathname: string): string => {
  let release = '/';
  const pathName = pathname.split('/');

  pathName.shift();

  if (pathName[0] === 'preview') {
    pathName.shift();
    release = `/preview/`;
  }

  return `${release}${pathName[0]}/${pathName[1] || ''}`;
};

const getPartialRouteFromPath = (path: string): string => {
  return path.replace(/^\/insights\/subscriptions\/inventory\/?/, '/');
};

export { getPartialRouteFromPath, getBaseName };
