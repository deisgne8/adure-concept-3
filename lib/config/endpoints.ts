const endpointEnvironmentVariables = {
  homePages: "WORDPRESS_HOME_PAGES_ENDPOINT",
  properties: "WORDPRESS_PROPERTIES_ENDPOINT",
  buildings: "WORDPRESS_BUILDINGS_ENDPOINT",
  units: "WORDPRESS_UNITS_ENDPOINT",
} as const;

export type WordPressEndpoint = keyof typeof endpointEnvironmentVariables;

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Add it to .env.local or the deployment environment.`,
    );
  }

  return value;
}

export function getWordPressUrl() {
  return getRequiredEnvironmentVariable("WORDPRESS_URL").replace(/\/$/, "");
}

export function getWordPressEndpoint(name: WordPressEndpoint) {
  const endpoint = getRequiredEnvironmentVariable(
    endpointEnvironmentVariables[name],
  );

  return new URL(endpoint, `${getWordPressUrl()}/`);
}
