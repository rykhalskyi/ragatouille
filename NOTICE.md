Ragatouille
============

This product includes software developed by the Ragatouille project.

Copyright (c) 2025-2026 Iaroslav Rykhalskyi

This project is licensed under the MIT License. See the accompanying `LICENSE` file for the full text.

IMPORTANT NOTICE
----------------

This project includes software licensed under the Apache License, Version 2.0.
When redistributing this software, you must comply with the terms of both the MIT License
and the Apache License, Version 2.0. See the `third_party_licenses/` directory for complete
license texts.

Third-Party Attributions and Notices
------------------------------------

This distribution includes third-party components that are governed by their own licenses.
Where a component provides a NOTICE file or additional attribution requirements, those notices
must be preserved when redistributing this software.

See `third_party_licenses/DEPENDENCIES_LICENSES.md` for a complete list of all third-party
dependencies and their licenses. The most commonly used licenses in this project are:

- **MIT License** (compatible with Apache 2.0)
- **Apache License 2.0** (see `third_party_licenses/APACHE-2.0.txt`)
- **BSD-3-Clause** (compatible with Apache 2.0)

Key Apache 2.0 Licensed Components:
- chromadb — https://github.com/chroma-core/chroma
- fastembed — https://github.com/qdrant/fastembed (contains NOTICE)
- huggingface_hub — https://github.com/huggingface/huggingface_hub
- kubernetes — https://github.com/kubernetes-client/python
- opentelemetry (api/sdk/exporters/proto) — https://github.com/open-telemetry/opentelemetry-python
- PyPika — https://github.com/kayak/pypika
- tokenizers — https://github.com/huggingface/tokenizers
- aiohttp and aio-libs packages — https://github.com/aio-libs
- pypdfium2 — https://github.com/pypdfium2-team/pypdfium2

Required actions for redistribution
---------------------------------

**When redistributing this software in any form (source or binary), you MUST:**

1. **Include the MIT License**
   - Copy the `LICENSE` file (MIT License) to your distribution

2. **Include the Apache License 2.0**
   - Copy `third_party_licenses/APACHE-2.0.txt` to your distribution
   
3. **Include this NOTICE file**
   - Copy this `NOTICE.md` file to your distribution

4. **Include dependency licenses**
   - Copy `third_party_licenses/DEPENDENCIES_LICENSES.md` to your distribution
   - This file lists all Apache 2.0 licensed and other third-party dependencies

5. **Create a third_party_licenses directory**
   - Include all files from the `third_party_licenses/` folder
   - Include at minimum: `APACHE-2.0.txt` and `DEPENDENCIES_LICENSES.md`

6. **Preserve all copyright notices**
   - Do not remove or obscure any copyright, patent, or attribution notices
   - In source distributions, preserve NOTICE files from upstream projects

**Summary of License Compliance:**
- Your code is released under the **MIT License**
- Third-party components use **Apache 2.0, MIT, BSD, and other open source licenses**
- All components used here are **compatible for redistribution together**
- You are **permitted to distribute commercially** as long as you include all license texts

**Directory structure for distribution:**
```
your-distribution/
├── LICENSE (MIT)
├── NOTICE.md
├── third_party_licenses/
│   ├── APACHE-2.0.txt
│   └── DEPENDENCIES_LICENSES.md
└── [your code and other files]
```

How to update this file
-----------------------

- Add new third-party entries when you add dependencies.
- Copy verbatim any NOTICE content from upstream projects and reference the upstream URL.
- Replace the placeholder copyright line above with the correct year(s) and copyright holder.

Questions or legal review
-------------------------

This file is an operational NOTICE template and does not constitute legal advice. For
questions about compliance, redistribution, or patent concerns, consult your legal counsel.
