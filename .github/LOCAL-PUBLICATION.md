# Local publication

GitHub runs the existing `node static/build.mjs` generator, checks its public output and saves a ZIP/checksum on successful main builds. The historical workflow filename deploy.yml now means build/validation only. It does not authenticate to a hosting account or publish a website.

Use the exact reviewed main commit and generated site/ directory for local publication through the operator's existing authenticated process. Keep private authentication files outside Git; ignored private folders must never be force-added. Do not publish the repository root. Confirm the existing project/domain, retain a rollback version and verify the public build marker, routes, sitemap, canonicals and assets after publication.

The build archive is public static output, not a certification of Google indexing, real inquiry delivery or human response. This change does not modify the educational/prayer content, language variants, form purposes or hosting account settings. No Git history rewrite or automatic production change was performed.
