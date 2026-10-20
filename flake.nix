{
  description = "FlareWatch development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    nix-vite-plus = {
      url = "github:ryoppippi/nix-vite-plus";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, nix-vite-plus, ... }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "aarch64-linux" "x86_64-linux" ];
    in {
      devShells = nixpkgs.lib.genAttrs systems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          vp = nix-vite-plus.packages.${system}.vp.override { nodejs = pkgs.nodejs_24; };
        in {
          default = pkgs.mkShell {
            packages = [ pkgs.nodejs_24 vp ];
            shellHook = ''
              export VP_HOME="$PWD/.direnv/vite-plus"
              export VP_NODE_MANAGER=no
              export VP_SELF_SETUP_NO_MODIFY_PATH=1
            '';
          };
        });
    };
}
