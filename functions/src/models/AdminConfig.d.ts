// firebase functions:config:get > .runtimeconfig.json

export interface AdminConfig {
  contentful: {
    space: string;
    preview: string;
    public: string;
    limit: string;
    maxage: string;
    manage: string;
  };
  napoancom: {
    auth: string;
  };
  twitter: {
    bearer: string;
    secret: string;
  };
}
