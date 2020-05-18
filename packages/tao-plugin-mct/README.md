# tao-plugin-mct

A [Tao.js](https://github.com/cleancoindev/tao.js) plugin for interacting with the
multi-collateral tao contracts



Please visit [docs.makerdao.com](https://docs.makerdao.com/building-with-maker/daijs) for more documentation.



### Local Development

Due to the way that Babel7 handles transpilation it is not possible to use `yarn link` when locally developing this plugin, and importing it. We recommend using [yalc](https://github.com/whitecolor/yalc) instead. We've also found that a watcher tool called [sane](https://github.com/amasad/sane) is helpful.

Steps to Run:
1. In this directory run ```sane "yalc publish && cd [INSERT THE DIRECTORY OF THE PROJECT THAT IS IMPORTING THIS PLUGIN] && yalc link @cleancoindev/tao-plugin-mct" src --wait=3 ```
