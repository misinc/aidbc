(function(app, BCAPI) {
	var defaultAccessToken = "Bearer _bc_Q2xpZW50SWQ9YmMtbWVldC10aGUtdGVhbTtHckx3a0hpOWFqZWJtcklReVYrOEdITUlIQVYyTlZoc3h1TkVqVHpyakhxVk9mZ0pnam9hQUVDODVBL05Sb096TFY5UmdlRnpMamhVbkZPTlQ4bGVqdjJ1SUVHcGJjWmFQSGZPRE9yZXNTQithQ2xHWlNLaVBFSmZYNkhYaWZYZzN5RWZIWlNOTVJGS1BhU1MvRlhGY1RsRWR3eUNkbkRHY0FteEh1ZjJxcVdXa3Z3QkZKUTBtV1MvY3BxeGxpMG8zUkxNRVlWbC9Ydm8xeVpmRWN6WEtPc2VMSkJlUVYraSthZnlTSFIxbGZqWDIwQklRNXNPeW1kWHhmODdZUkZkc1FEVnhQaXZyTytHMG5RWDA2Mmx5SGw5bjlSV0h1OS85S3MyQkx5eFVVbXhpOWFZdnkvTWVnRDlMcUs3eSs4NEt5QlkvTXpxenpJb3JvNGtnN3lQSkE9PQ==",
		defaultHost = "bc-meet-the-team-38581-apps.rcosnita-bc.worldsecuresystems.com";
		defaultProtocol = "https";

	/**
	 * @constructor
	 @ description
	 * This class contains all configuraion values required to control various features of BC discovery
	 * app.
	 */
	function ConfigService() {
		this.appVersion = "1.0-snapshot",
		this.bcWebResourcesApp = "/webresources",
		this.bcRegistryUrl = this.bcWebResourcesApp + "/api/v3/sites/current/registry";

		this.limits = {
			skip: 0,
			limit: 10
		};
		
		this.api = {
			accessToken: BCAPI.Helper.Site.getAccessToken() || defaultAccessToken,
			host: undefined /*defaultHost*/,
			protocol: undefined /*defaultProtocol*/
		};

		this.errors = {
			"displayTimeout": 4000
		};
	};

	app.service("ConfigService", [ConfigService]);
})(DiscoveryApp, BCAPI);