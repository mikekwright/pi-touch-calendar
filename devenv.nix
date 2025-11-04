{ pkgs, project-name, ... }:

{
  # https://devenv.sh/basics/
  env.PROJECT_NAME = project-name;

  languages.typescript = {
    enable = true;
  };

  packages = with pkgs; [
    nodejs
    yarn
  ];

  scripts.helpme.exec = ''
    echo "Create an electron app"
    echo "    npx create-electron-app@latest my-app"
    echo "    npm start"
    echo ""
    echo "Create a nextjs app"
    echo "    npx create-next-app@latest my-app"
    echo "    npm run start"
    echo ""
  '';
}

