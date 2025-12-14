{
  "extends": "../../../../eslint.config.mjs",
  "overrides": [
    {
      "files": ["*.ts"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBoundaryConstraints": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              }
            ]
          }
        ]
      },
      "extends": [
        "plugin:@nx/typescript"
      ]
    },
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@nx/angular-template"
      ]
    }
  ]
}
