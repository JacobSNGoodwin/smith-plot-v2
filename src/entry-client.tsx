// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

import '@unocss/reset/tailwind-compat.css';
import 'virtual:uno.css';

mount(() => <StartClient />, document.getElementById("app")!);
