{
  description = "Flake to setup devenv for typescript/node app development";

  inputs = {
    # Node version 24.11.0
    nixpkgs.url = "github:nixos/nixpkgs/7241bcbb4f099a66aafca120d37c65e8dda32717";
    devenv.url = "github:cachix/devenv";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@{ self, nixpkgs, flake-parts, devenv, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ devenv.flakeModule ];

      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ];

      perSystem = { system, pkgs, ... }: 
        let
          project-name = "node-app";
        in
        {
          devenv.shells.default = {
            _module.args = { inherit project-name; };
            imports = [ 
              ./devenv.nix 
            ];
          };
      };
    };
}

