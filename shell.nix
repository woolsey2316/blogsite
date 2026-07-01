{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # Add the Python interpreter and native dependencies here
  packages = [
    (pkgs.python3.withPackages (python-pkgs: [
      python-pkgs.numpy
      python-pkgs.pandas
      python-pkgs.requests
    ]))
  ];

  # Run commands automatically upon entering the shell
  shellHook = ''
    echo "Python development environment loaded!"
    python --version
  '';
}