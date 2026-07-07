{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # Packages installed inside the environment
  buildInputs = with pkgs; [
    python3
    python3Packages.pip
    python3Packages.virtualenv
    postgresql 
    # Native C dependencies frequently needed by python wheels
    stdenv.cc.cc.lib
    zlib
    glibc
  ];

  # Fixes issues with pre-compiled wheels looking for standard libraries
  shellHook = ''
    # Added pkgs.postgresql.lib here so psycopg2 can find libpq.so at runtime
    export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath [ pkgs.stdenv.cc.cc.lib pkgs.zlib pkgs.postgresql.lib ]}:$LD_LIBRARY_PATH"
    
    # Automate virtualenv creation and activation
    if [ ! -d ".venv" ]; then
      python -m venv .venv
    fi
    source .venv/bin/activate
    
    echo "Python environment active. Run 'pip install -r requirements.txt' to update packages."
  '';
}