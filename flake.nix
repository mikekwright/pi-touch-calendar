{
  description = "Packager for electron app pi-touch-calendar.";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    {
      overlays.default = final: prev: {
        my-electron-app = prev.pkgs.callPackage ./package.nix {};
      };
    } //
    (flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = import nixpkgs {
              inherit system;
              overlays = [ self.overlays.default ];
            };
        in
          {
            packages.my-electron-app = pkgs.my-electron-app;
            packages.default = pkgs.my-electron-app;
          }
      ));
}
