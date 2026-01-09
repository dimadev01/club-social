# Changelog

## [0.8.1](https://github.com/dimadev01/club-social/compare/api-v0.8.0...api-v0.8.1) (2026-01-09)


### Bug Fixes

* **payment:** streamline payment creation process and add validation … ([0603c6b](https://github.com/dimadev01/club-social/commit/0603c6b9001f20d93e7190972b576e92910a6ab2))
* **payment:** streamline payment creation process and add validation for zero amounts ([4f75034](https://github.com/dimadev01/club-social/commit/4f750340238e402ed5d12f332dbb4f8c0e97752a))

## [0.8.0](https://github.com/dimadev01/club-social/compare/api-v0.7.2...api-v0.8.0) (2026-01-09)


### Features

* separate email queues ([4d49d60](https://github.com/dimadev01/club-social/commit/4d49d606200d5342e8dacfb8785bfa152693319f))

## [0.7.2](https://github.com/dimadev01/club-social/compare/api-v0.7.1...api-v0.7.2) (2026-01-09)


### Bug Fixes

* enhance validation for zero amounts in payment, due, and movement entities ([c94d994](https://github.com/dimadev01/club-social/commit/c94d99456fc8a8f9585e7820338643aebcfb7c9d))
* **payment:** update resetFields in PaymentNew to include new fields ([7870f70](https://github.com/dimadev01/club-social/commit/7870f705567dbd7fc9db1418d627e4acb5c68d7e))
* **payment:** update resetFields in PaymentNew to include new fields ([26162da](https://github.com/dimadev01/club-social/commit/26162da87f884331fe1fc681ffee0b789ca57c8c))

## [0.7.1](https://github.com/dimadev01/club-social/compare/api-v0.7.0...api-v0.7.1) (2026-01-08)


### Bug Fixes

* **queue:** remove complete jobs from queues ([09ff3f7](https://github.com/dimadev01/club-social/commit/09ff3f7cf4830977dfb33be29d4f75ec5ac655e5))
* **queue:** remove complete jobs from queues ([2446a5b](https://github.com/dimadev01/club-social/commit/2446a5b329fe185b56f228f18844e680746d8031))

## [0.7.0](https://github.com/dimadev01/club-social/compare/api-v0.6.1...api-v0.7.0) (2026-01-08)


### Features

* **app-settings:** add SEND_MEMBER_NOTIFICATIONS setting and update related functionality ([9414977](https://github.com/dimadev01/club-social/commit/94149775cbcf3a3fd2fb64864c67fbdcce7b4a96))
* **email:** implement new payment notification system and enhance email handling ([c656e2b](https://github.com/dimadev01/club-social/commit/c656e2b017b922a52ea40fc04176b74b9f9c5c60))
* **value-objects:** change toString method visibility and add unit tests for UserPreferences ([5718ff4](https://github.com/dimadev01/club-social/commit/5718ff46227082af6587087c07e6206118469de9))


### Bug Fixes

* **email:** correct conditional logic for nodemailer service initialization ([e352b2b](https://github.com/dimadev01/club-social/commit/e352b2bddca4724e9898bc40b76d664723bbe903))

## [0.6.1](https://github.com/dimadev01/club-social/compare/api-v0.6.0...api-v0.6.1) (2026-01-07)


### Bug Fixes

* **member:** streamline member data fetching and enhance export functionality ([0e1a1b7](https://github.com/dimadev01/club-social/commit/0e1a1b7c290c852dec82338d621b801ebbeba7e4))

## [0.6.0](https://github.com/dimadev01/club-social/compare/api-v0.5.0...api-v0.6.0) (2026-01-07)


### Features

* **pricing:** Improve pricing handling ([19142f8](https://github.com/dimadev01/club-social/commit/19142f8b20e25b63df646c66ed272ce8ec43a9b8))

## [0.5.0](https://github.com/dimadev01/club-social/compare/api-v0.4.1...api-v0.5.0) (2026-01-07)


### Features

* update form handling and UI components ([4d0641e](https://github.com/dimadev01/club-social/commit/4d0641e5d76416a87d3690993c2bf052bacafbc5))

## [0.4.1](https://github.com/dimadev01/club-social/compare/api-v0.4.0...api-v0.4.1) (2026-01-07)


### Bug Fixes

* pass user name in controller ([3ae47f4](https://github.com/dimadev01/club-social/commit/3ae47f4d18a6ac6b2888862238aca99eb8202f8b))

## [0.4.0](https://github.com/dimadev01/club-social/compare/api-v0.3.2...api-v0.4.0) (2026-01-06)


### Features

* **api:** add unit tests ([7f39104](https://github.com/dimadev01/club-social/commit/7f39104537bd9ac00304b6cc0893e8ba4b3dfb42))

## [0.3.2](https://github.com/dimadev01/club-social/compare/api-v0.3.1...api-v0.3.2) (2026-01-06)


### Bug Fixes

* **api:** add test instruction to README ([50b41cc](https://github.com/dimadev01/club-social/commit/50b41cc205f326792734dee9213201ff6fa894ee))

## [0.3.1](https://github.com/dimadev01/club-social/compare/api-v0.3.0...api-v0.3.1) (2026-01-06)


### Bug Fixes

* test action ([2d66a19](https://github.com/dimadev01/club-social/commit/2d66a1959222d3621d23661079d73064b665a9f4))

## [0.3.0](https://github.com/dimadev01/club-social/compare/api-v0.2.0...api-v0.3.0) (2026-01-06)


### Features

* add @club-social/types package for shared types and update user management with new DTOs ([e6bdc1b](https://github.com/dimadev01/club-social/commit/e6bdc1b099fea88d8d999a6261c6bc51e099ee9c))
* add address formatting utility and integrate it into MemberView component ([cff37c2](https://github.com/dimadev01/club-social/commit/cff37c21927c4264f5f311734fefa3e35351ecfa))
* add authId to User model and update related mappers and services for user creation ([8b456f6](https://github.com/dimadev01/club-social/commit/8b456f60fa17f2855620d5e3d8b00e05a4ab20a4))
* add balance field to member models and implement sorting by balance in member repository ([76700c7](https://github.com/dimadev01/club-social/commit/76700c7b4b41e94e2e0bb0621c397a83f39cda89))
* add daily payments bar chart to home page ([fe07004](https://github.com/dimadev01/club-social/commit/fe070047d36f8b18e93a26b9d5da83fe526c31b7))
* add date range filtering to audit logs and improve UI rendering ([64f2824](https://github.com/dimadev01/club-social/commit/64f282491da312915a813f8509007b754cd9c268))
* add date range filtering to dues and payments statistics ([07e2846](https://github.com/dimadev01/club-social/commit/07e2846bb9764e21a34cea357b95ac0c3ce3ec0e))
* add dotenvx for environment variable management and update Prisma migration setup ([cc85157](https://github.com/dimadev01/club-social/commit/cc85157c991300de0af3dbad8800db34dff43a20))
* add dues management functionality ([0e56534](https://github.com/dimadev01/club-social/commit/0e5653496bfd431c4e7472f3b8ba3185f9a143ca))
* add ESLint configuration and cursor ignore file, update package dependencies ([60360ee](https://github.com/dimadev01/club-social/commit/60360ee63ebc29d462864e011859aaaeb20e2c38))
* add filters support to pagination requests for dues and members management ([fc3204a](https://github.com/dimadev01/club-social/commit/fc3204a0a844d256c3856b2d2966350f182625af))
* add findPending method and refactor pending statistics handling in dues repository ([50ffe32](https://github.com/dimadev01/club-social/commit/50ffe3214fe13734803ed8606b9a921b8d170451))
* add MailDev service for email testing ([5baed9e](https://github.com/dimadev01/club-social/commit/5baed9e8e61fbb1fd8db05562b90a720e10e1b4d))
* add marital status to Member model ([43430bf](https://github.com/dimadev01/club-social/commit/43430bf263abc5af8eaee859aa7edbbfced97928))
* add member balance retrieval functionality ([884c832](https://github.com/dimadev01/club-social/commit/884c832a6bb471a5671afb8def810a40d73764b3))
* add name field to Member model and update related components ([b69640a](https://github.com/dimadev01/club-social/commit/b69640a0171d93e80d0c3d4dd773f86db4f5a8b3))
* add name field to user DTO and controller, update icons in various components ([f98534b](https://github.com/dimadev01/club-social/commit/f98534b75fe7cc491d5dc2c95e5fbcdd533827a9))
* add nestjs-cls for context management and enhance user update ([c1288bc](https://github.com/dimadev01/club-social/commit/c1288bc978a7578c462c964f43d6ed5f9e4b3d3c))
* add payment status management and void functionality to payment entity and related components ([69b5984](https://github.com/dimadev01/club-social/commit/69b5984263fa1efb4f468e6cfd6ca3b557b5e306))
* add pending dues retrieval and display functionality in dues management ([5416ba6](https://github.com/dimadev01/club-social/commit/5416ba69778829af2d0e2fdb5f59839af508a7f0))
* add pending statistics feature for dues and movements ([3776c08](https://github.com/dimadev01/club-social/commit/3776c085b89bf1200f9d458c04d5d4e729c195dc))
* add receipt number field to payment management and update related DTOs ([957c073](https://github.com/dimadev01/club-social/commit/957c0736dfe0ac21020d32ead54a4a20c2050cc9))
* add Redis Insight service, and improve email processing limits ([4480987](https://github.com/dimadev01/club-social/commit/448098715ca0aed1d15dbe48c885545744256a4b))
* add routing and authentication components, integrate React Router, and update config ([e5c0fcf](https://github.com/dimadev01/club-social/commit/e5c0fcf02fd9662c7b0816587eef001c3649ccb9))
* add seeding functionality and integrate faker ([c54d8c4](https://github.com/dimadev01/club-social/commit/c54d8c4e8bc47b1c2032467699517e30189eb015))
* add Sentry CLI for improved error tracking and source map management in the API ([ac7dbae](https://github.com/dimadev01/club-social/commit/ac7dbae4c60f9b65a7e1ad70b3212526a4d30d74))
* add sorting functionality for member dues in API and UI ([fe18fc6](https://github.com/dimadev01/club-social/commit/fe18fc69c317f6bfcb801d054eb387bf91f137cc))
* add void due functionality and enhance dues management with new DTOs ([68715ee](https://github.com/dimadev01/club-social/commit/68715eecc91bb6ae28d7614888c94c6151b3b628))
* enhance API with Swagger integration, validation pipes, and base controller for error handling ([c9ef2d5](https://github.com/dimadev01/club-social/commit/c9ef2d5c1db11552324091e256aae80d14c50b7e))
* enhance authentication and configuration with better-auth integration ([97ea413](https://github.com/dimadev01/club-social/commit/97ea413be451001500d980b98dd9fb67ae2332d3))
* enhance dues and members management with new pagination and detail DTOs ([28a9706](https://github.com/dimadev01/club-social/commit/28a97064579cd98703c728d764713bd8900336c1))
* enhance dues and payments management ([875be17](https://github.com/dimadev01/club-social/commit/875be17943d2275e98ff259fe426f295e06c11a6))
* enhance dues and payments management with detailed models and UI updates ([f3cfe7f](https://github.com/dimadev01/club-social/commit/f3cfe7f69c1a9605ba82852e477f91b80193fdbb))
* enhance email functionality and user preferences management ([#39](https://github.com/dimadev01/club-social/issues/39)) ([fb6e5aa](https://github.com/dimadev01/club-social/commit/fb6e5aad9bc93a99dd5fcc47a98ac03bc043e7b6))
* enhance filtering and sorting capabilities in member and dues management ([efc3e75](https://github.com/dimadev01/club-social/commit/efc3e75e61449ce766b8a64f1b5a48979d959fb4))
* enhance member and payment management with detailed due summaries and UI updates ([d5658f3](https://github.com/dimadev01/club-social/commit/d5658f35622bb7d5b9eec410aad2d77a9669217f))
* enhance member DTOs and controller to include email and address details ([0f4b619](https://github.com/dimadev01/club-social/commit/0f4b619a03f6d8100712436a5e950ac01e1c129a))
* enhance member listing with sorting and pagination state management ([b71e25d](https://github.com/dimadev01/club-social/commit/b71e25d5f1eeb88f7496a2c5d0ab564f7fcf2355))
* enhance member search and due management with category integration ([85711b4](https://github.com/dimadev01/club-social/commit/85711b41e0f3eda7b4bc823f68e681f588b635a2))
* enhance Movements module with CRUD operations and UI ([8c22030](https://github.com/dimadev01/club-social/commit/8c22030f56cf42adcfdeda218a350ad7399c2f47))
* enhance paginated responses with summary models for dues, movements, and payments ([34c77d7](https://github.com/dimadev01/club-social/commit/34c77d7660c4b85549845d758bcccabb4a55e239))
* enhance payment and due management by adding member association ([681469b](https://github.com/dimadev01/club-social/commit/681469b2d83c13d1fd672d6cea4f1186e07b74dc))
* enhance payment and due management by adding receipt number ([aa83e93](https://github.com/dimadev01/club-social/commit/aa83e93c429dceb7f52600baa3362a633de0865d))
* enhance payment and due management with upsert functionality and improved void handling ([0077e86](https://github.com/dimadev01/club-social/commit/0077e8695fc545c330720e04318abd0630333ea6))
* enhance payment management by integrating payment dues handling and updating related DTOs ([e553207](https://github.com/dimadev01/club-social/commit/e55320783fb7c403d115fc53d64b0d71f4ed2983))
* enhance payment processing by adding support for balance application ([94949bd](https://github.com/dimadev01/club-social/commit/94949bdb69fb0a6bcf62a762ab2b60b0fc68fd9b))
* enhance user entity and presentation layers with full name property and loading states ([8ea21de](https://github.com/dimadev01/club-social/commit/8ea21de21f7e0ae3e4c77c6037b78454995863c2))
* enhance user interface and permissions management with new routes and loading states ([55c6237](https://github.com/dimadev01/club-social/commit/55c623780e65059e48070ce21132d464cbc46651))
* enhance user management ([7f23558](https://github.com/dimadev01/club-social/commit/7f23558a5c50b185e81cfcbdcfc73ba777fbd4d3))
* enhance user management with Prisma integration and repository pattern implementation ([bbf1a7e](https://github.com/dimadev01/club-social/commit/bbf1a7e4896687da6e8a002ae076a3dcf7e7ad30))
* expand pricing module with filtering options and UI enhancements for better data management ([c9a0b1e](https://github.com/dimadev01/club-social/commit/c9a0b1e8da153d0bd57fddca0601b461f700bbd8))
* implement aggregate root and entity patterns with domain events in the API ([430b714](https://github.com/dimadev01/club-social/commit/430b714bf5731d4a12c522808cc2876893617665))
* implement audit logs feature with paginated response and UI integration ([58c84d8](https://github.com/dimadev01/club-social/commit/58c84d8cc82a151cd115b1e8f6707e6ea2c6eca0))
* implement CreateDue2 use case and related entities for enhanced due management ([2ff99be](https://github.com/dimadev01/club-social/commit/2ff99bec74826f473dab66fcad8dea7800730673))
* implement dues and payments management module with CRUD operations ([6da7612](https://github.com/dimadev01/club-social/commit/6da7612d81cfe3c1ebdc8e5a3dea8a7d77a9dd0a))
* implement export functionality for dues, members, movements, and payments with CSV ([5d2c62c](https://github.com/dimadev01/club-social/commit/5d2c62cbd37038c4afdfb9c3a813c56fde0f9e32))
* implement feature flags for maintenance mode and integrate into API and web applications ([683f894](https://github.com/dimadev01/club-social/commit/683f894930e67c5b7b1a3e060ae33cdffd5e676c))
* implement member management module ([35b5653](https://github.com/dimadev01/club-social/commit/35b565339f7d68f8ea16053cc4893d655f3f2382))
* implement Member model with related CRUD operations ([6544de5](https://github.com/dimadev01/club-social/commit/6544de538b0819baf72e942ff83961ca423ea4b0))
* implement member search functionality with filtering and selection capabilities ([b5bcd8f](https://github.com/dimadev01/club-social/commit/b5bcd8f0d6557596cd12d48f32cd1556c1a38978))
* implement movement and payment statistics features with new API ([e9e5d5a](https://github.com/dimadev01/club-social/commit/e9e5d5a924d79c0024ed3a4e2bbed466a5ade887))
* implement payment due status management ([d525847](https://github.com/dimadev01/club-social/commit/d525847c3c93be91c6ac1c5292520797a248598f))
* implement payment statistics feature with API integration and UI components ([901d66e](https://github.com/dimadev01/club-social/commit/901d66ed3d4db61e4c536528daa8c932f86a67ee))
* implement user creation and pagination with DTOs and Swagger integration ([bf2c05b](https://github.com/dimadev01/club-social/commit/bf2c05b07ca1e34af704ee984c6cc5f800d8b5e4))
* implement user management use cases and domain entities ([8291742](https://github.com/dimadev01/club-social/commit/82917421f5310d135dea655d760fa16fb7c1ba6c))
* implement user profile management ([7388e78](https://github.com/dimadev01/club-social/commit/7388e78da1dc6676c070f158525f00f49a7c9c5c))
* implement user retrieval endpoint and refactor routing for users ([cf9c35c](https://github.com/dimadev01/club-social/commit/cf9c35cb3e4e6f517b6403246fecc03b94a74778))
* integrate @itgorillaz/configify for configuration management ([3be7f2d](https://github.com/dimadev01/club-social/commit/3be7f2de06897e0afa76f6887b043759c9672104))
* integrate @logtail/pino for enhanced logging ([a5085b4](https://github.com/dimadev01/club-social/commit/a5085b42d7187e57c879db59e38df7cd8222cf06))
* integrate Ant Design components and update styling ([5418440](https://github.com/dimadev01/club-social/commit/541844087a217f380f4d51d45456c87ffad0d91b))
* integrate audit logging functionality with new AuditLog model and related updates ([aabea9b](https://github.com/dimadev01/club-social/commit/aabea9bde8eff93c423c8950004927d7dcbb53a9))
* integrate Auth0 for authentication ([6b992e5](https://github.com/dimadev01/club-social/commit/6b992e52a9fc1db0856711f33c6c0dbd8d966402))
* integrate better-auth for authentication ([dec7252](https://github.com/dimadev01/club-social/commit/dec7252f612d4f58b650cf4dae0e8b0487d215ee))
* integrate email services with Nodemailer and Resend ([7952002](https://github.com/dimadev01/club-social/commit/79520024b1acbd5a1c05e2877dc95dc0c4bb0dc3))
* integrate event-driven architecture with DomainEvent and DomainEventPublisher ([594516b](https://github.com/dimadev01/club-social/commit/594516b7317593fe150a3481bbc62e99cca7cdba))
* integrate logging and tracing with Logtail and Winston in the API ([7040989](https://github.com/dimadev01/club-social/commit/7040989666106655bdc2681dbcc7c4edd6605dac))
* integrate member category into due management and enhance UI with improved layout ([1e6328f](https://github.com/dimadev01/club-social/commit/1e6328f5dbe772d20b566f2a0d63bfa0316f495a))
* integrate Prisma for database management and add configuration for environment variables ([fd12b47](https://github.com/dimadev01/club-social/commit/fd12b473b9182fac98b841ea2116495109b90004))
* integrate Redis and BullMQ for email processing ([53792d5](https://github.com/dimadev01/club-social/commit/53792d5501f36a2fb0daf537a1530255fe62bf55))
* integrate Sentry for error tracking and performance monitoring in the API ([881584c](https://github.com/dimadev01/club-social/commit/881584c7106e600038207bc82f44f8a7223d8706))
* integrate Supabase for user management and enhance configuration with Supabase settings ([50992cc](https://github.com/dimadev01/club-social/commit/50992cc42f5b44ffacc88d63cab271a9a5f74a96))
* introduce DateRange value object for precise date filtering ([4fc4927](https://github.com/dimadev01/club-social/commit/4fc49271647b345b35b74a87a3bfca4cfa50b0d5))
* introduce member ledger functionality ([2bc3418](https://github.com/dimadev01/club-social/commit/2bc3418dbe64c37b4080a393e323dc8b9ba41ffa))
* introduce movement mode functionality and update related models, mappers, and UI components ([6b7cedb](https://github.com/dimadev01/club-social/commit/6b7cedb5a604ec7692164b8602afdeb0b2c8adf3))
* introduce movement read models and refactor repository methods to utilize new structures ([02b4ff1](https://github.com/dimadev01/club-social/commit/02b4ff1e12b5ae873899226e241eec9f3d9a477d))
* introduce Movements module for managing financial movements ([2c7311b](https://github.com/dimadev01/club-social/commit/2c7311b8cd5fce10e8148d25acad9262cbd4b41a))
* introduce pricing module with CRUD operations, event handling, and database integration ([74f44a4](https://github.com/dimadev01/club-social/commit/74f44a466ff8b9e21fb62fc69eb3f4be549317d3))
* introduce role management in User model, update related services and repositories ([cb21a2f](https://github.com/dimadev01/club-social/commit/cb21a2f95685139f966b3999c0f6d9bf031fd157))
* introduce sorting and pagination enhancements across dues and members management ([e93cd98](https://github.com/dimadev01/club-social/commit/e93cd9822fc3612c9ba5708c2e31d3ba45830fa6))
* refactor dues and payments structure by introducing due settlements ([ab9e587](https://github.com/dimadev01/club-social/commit/ab9e587c529a7389a255089325a137857b107630))
* refactor payment management ([f82cf71](https://github.com/dimadev01/club-social/commit/f82cf7171105a5dd0521c3940eeb109cca993985))
* refactor user authentication and management with better-auth integration ([603261b](https://github.com/dimadev01/club-social/commit/603261b200b500447b01334a88551b575a2fb817))
* update dependencies and add Jest configuration for API testing ([6667aa2](https://github.com/dimadev01/club-social/commit/6667aa24bcd2f50646dc0eed7a833a8a998af9cf))
* update due filtering and DTOs to include user status and improve pagination ([32dcf82](https://github.com/dimadev01/club-social/commit/32dcf827429425f016ca6742758a0d6358e378ac))
* update environment configuration and enhance config schema with Better Stack ([d295031](https://github.com/dimadev01/club-social/commit/d29503186ef4feef720e0d7ee3d3b26a699e54d3))
* update member and payment management ([96d74fe](https://github.com/dimadev01/club-social/commit/96d74fefdea9a390f0c5b6f59701295cc0569031))
* update user management and authentication configurations with better-auth integration ([ff3b023](https://github.com/dimadev01/club-social/commit/ff3b023c792daa79a4a1c557e8feb33d4ac9fe80))
* update user management with new update functionality, refactor user-related services ([5b16928](https://github.com/dimadev01/club-social/commit/5b16928579e4f1e96d98fd26caf725717e41c5a8))
* update user repository to use Supabase, enhance ESLint configuration, and add new dependencies ([7c54ba7](https://github.com/dimadev01/club-social/commit/7c54ba7fb6f853d16522161936a56297ef3afaa6))


### Bug Fixes

* correct production start script path in API package.json ([be7a1f1](https://github.com/dimadev01/club-social/commit/be7a1f1ca6eaad76f354ae89618247698ee6ee1f))
* remove MongoDB dependencies, and clean up unused files ([#36](https://github.com/dimadev01/club-social/issues/36)) ([#37](https://github.com/dimadev01/club-social/issues/37)) ([e0e7f2f](https://github.com/dimadev01/club-social/commit/e0e7f2fb211a392623b82a6b871bc3e53f7ea336))
* update sorting field in PrismaPaymentRepository from 'date' to '… ([#40](https://github.com/dimadev01/club-social/issues/40)) ([fdbec11](https://github.com/dimadev01/club-social/commit/fdbec1191371a76d5229f9c1d284b9cd04ed3e93))

## [0.1.2](https://github.com/dimadev01/club-social/compare/api-v0.1.1...api-v0.1.2) (2026-01-06)

### Bug Fixes

- update sorting field in PrismaPaymentRepository from 'date' to '… ([#40](https://github.com/dimadev01/club-social/issues/40)) ([77116d2](https://github.com/dimadev01/club-social/commit/77116d2b2fa0dd987036acf5da114e02b4c42b16))

## [0.1.1](https://github.com/dimadev01/club-social/compare/api-v0.1.0...api-v0.1.1) (2026-01-05)

### Bug Fixes

- remove MongoDB dependencies, and clean up unused files ([#36](https://github.com/dimadev01/club-social/issues/36)) ([#37](https://github.com/dimadev01/club-social/issues/37)) ([f0997b8](https://github.com/dimadev01/club-social/commit/f0997b857b072df319d61be66bb9186d3de4d142))

## [0.1.0](https://github.com/dimadev01/club-social/compare/api-v0.0.1...api-v0.1.0) (2026-01-04)

### Features

- add @club-social/types package for shared types and update user management with new DTOs ([e6bdc1b](https://github.com/dimadev01/club-social/commit/e6bdc1b099fea88d8d999a6261c6bc51e099ee9c))
- add address formatting utility and integrate it into MemberView component ([cff37c2](https://github.com/dimadev01/club-social/commit/cff37c21927c4264f5f311734fefa3e35351ecfa))
- add authId to User model and update related mappers and services for user creation ([8b456f6](https://github.com/dimadev01/club-social/commit/8b456f60fa17f2855620d5e3d8b00e05a4ab20a4))
- add balance field to member models and implement sorting by balance in member repository ([76700c7](https://github.com/dimadev01/club-social/commit/76700c7b4b41e94e2e0bb0621c397a83f39cda89))
- add daily payments bar chart to home page ([fe07004](https://github.com/dimadev01/club-social/commit/fe070047d36f8b18e93a26b9d5da83fe526c31b7))
- add date range filtering to audit logs and improve UI rendering ([64f2824](https://github.com/dimadev01/club-social/commit/64f282491da312915a813f8509007b754cd9c268))
- add date range filtering to dues and payments statistics ([07e2846](https://github.com/dimadev01/club-social/commit/07e2846bb9764e21a34cea357b95ac0c3ce3ec0e))
- add dotenvx for environment variable management and update Prisma migration setup ([cc85157](https://github.com/dimadev01/club-social/commit/cc85157c991300de0af3dbad8800db34dff43a20))
- add dues management functionality ([0e56534](https://github.com/dimadev01/club-social/commit/0e5653496bfd431c4e7472f3b8ba3185f9a143ca))
- add ESLint configuration and cursor ignore file, update package dependencies ([60360ee](https://github.com/dimadev01/club-social/commit/60360ee63ebc29d462864e011859aaaeb20e2c38))
- add filters support to pagination requests for dues and members management ([fc3204a](https://github.com/dimadev01/club-social/commit/fc3204a0a844d256c3856b2d2966350f182625af))
- add findPending method and refactor pending statistics handling in dues repository ([50ffe32](https://github.com/dimadev01/club-social/commit/50ffe3214fe13734803ed8606b9a921b8d170451))
- add MailDev service for email testing ([5baed9e](https://github.com/dimadev01/club-social/commit/5baed9e8e61fbb1fd8db05562b90a720e10e1b4d))
- add marital status to Member model ([43430bf](https://github.com/dimadev01/club-social/commit/43430bf263abc5af8eaee859aa7edbbfced97928))
- add member balance retrieval functionality ([884c832](https://github.com/dimadev01/club-social/commit/884c832a6bb471a5671afb8def810a40d73764b3))
- add name field to Member model and update related components ([b69640a](https://github.com/dimadev01/club-social/commit/b69640a0171d93e80d0c3d4dd773f86db4f5a8b3))
- add name field to user DTO and controller, update icons in various components ([f98534b](https://github.com/dimadev01/club-social/commit/f98534b75fe7cc491d5dc2c95e5fbcdd533827a9))
- add nestjs-cls for context management and enhance user update ([c1288bc](https://github.com/dimadev01/club-social/commit/c1288bc978a7578c462c964f43d6ed5f9e4b3d3c))
- add payment status management and void functionality to payment entity and related components ([69b5984](https://github.com/dimadev01/club-social/commit/69b5984263fa1efb4f468e6cfd6ca3b557b5e306))
- add pending dues retrieval and display functionality in dues management ([5416ba6](https://github.com/dimadev01/club-social/commit/5416ba69778829af2d0e2fdb5f59839af508a7f0))
- add pending statistics feature for dues and movements ([3776c08](https://github.com/dimadev01/club-social/commit/3776c085b89bf1200f9d458c04d5d4e729c195dc))
- add receipt number field to payment management and update related DTOs ([957c073](https://github.com/dimadev01/club-social/commit/957c0736dfe0ac21020d32ead54a4a20c2050cc9))
- add Redis Insight service, and improve email processing limits ([4480987](https://github.com/dimadev01/club-social/commit/448098715ca0aed1d15dbe48c885545744256a4b))
- add routing and authentication components, integrate React Router, and update config ([e5c0fcf](https://github.com/dimadev01/club-social/commit/e5c0fcf02fd9662c7b0816587eef001c3649ccb9))
- add seeding functionality and integrate faker ([c54d8c4](https://github.com/dimadev01/club-social/commit/c54d8c4e8bc47b1c2032467699517e30189eb015))
- add Sentry CLI for improved error tracking and source map management in the API ([ac7dbae](https://github.com/dimadev01/club-social/commit/ac7dbae4c60f9b65a7e1ad70b3212526a4d30d74))
- add sorting functionality for member dues in API and UI ([fe18fc6](https://github.com/dimadev01/club-social/commit/fe18fc69c317f6bfcb801d054eb387bf91f137cc))
- add void due functionality and enhance dues management with new DTOs ([68715ee](https://github.com/dimadev01/club-social/commit/68715eecc91bb6ae28d7614888c94c6151b3b628))
- enhance API with Swagger integration, validation pipes, and base controller for error handling ([c9ef2d5](https://github.com/dimadev01/club-social/commit/c9ef2d5c1db11552324091e256aae80d14c50b7e))
- enhance authentication and configuration with better-auth integration ([97ea413](https://github.com/dimadev01/club-social/commit/97ea413be451001500d980b98dd9fb67ae2332d3))
- enhance dues and members management with new pagination and detail DTOs ([28a9706](https://github.com/dimadev01/club-social/commit/28a97064579cd98703c728d764713bd8900336c1))
- enhance dues and payments management ([875be17](https://github.com/dimadev01/club-social/commit/875be17943d2275e98ff259fe426f295e06c11a6))
- enhance dues and payments management with detailed models and UI updates ([f3cfe7f](https://github.com/dimadev01/club-social/commit/f3cfe7f69c1a9605ba82852e477f91b80193fdbb))
- enhance filtering and sorting capabilities in member and dues management ([efc3e75](https://github.com/dimadev01/club-social/commit/efc3e75e61449ce766b8a64f1b5a48979d959fb4))
- enhance member and payment management with detailed due summaries and UI updates ([d5658f3](https://github.com/dimadev01/club-social/commit/d5658f35622bb7d5b9eec410aad2d77a9669217f))
- enhance member DTOs and controller to include email and address details ([0f4b619](https://github.com/dimadev01/club-social/commit/0f4b619a03f6d8100712436a5e950ac01e1c129a))
- enhance member listing with sorting and pagination state management ([b71e25d](https://github.com/dimadev01/club-social/commit/b71e25d5f1eeb88f7496a2c5d0ab564f7fcf2355))
- enhance member search and due management with category integration ([85711b4](https://github.com/dimadev01/club-social/commit/85711b41e0f3eda7b4bc823f68e681f588b635a2))
- enhance Movements module with CRUD operations and UI ([8c22030](https://github.com/dimadev01/club-social/commit/8c22030f56cf42adcfdeda218a350ad7399c2f47))
- enhance paginated responses with summary models for dues, movements, and payments ([34c77d7](https://github.com/dimadev01/club-social/commit/34c77d7660c4b85549845d758bcccabb4a55e239))
- enhance payment and due management by adding member association ([681469b](https://github.com/dimadev01/club-social/commit/681469b2d83c13d1fd672d6cea4f1186e07b74dc))
- enhance payment and due management by adding receipt number ([aa83e93](https://github.com/dimadev01/club-social/commit/aa83e93c429dceb7f52600baa3362a633de0865d))
- enhance payment and due management with upsert functionality and improved void handling ([0077e86](https://github.com/dimadev01/club-social/commit/0077e8695fc545c330720e04318abd0630333ea6))
- enhance payment management by integrating payment dues handling and updating related DTOs ([e553207](https://github.com/dimadev01/club-social/commit/e55320783fb7c403d115fc53d64b0d71f4ed2983))
- enhance payment processing by adding support for balance application ([768b3e4](https://github.com/dimadev01/club-social/commit/768b3e43c10bad6079e340de8a4638d3927cdb83))
- enhance user entity and presentation layers with full name property and loading states ([8ea21de](https://github.com/dimadev01/club-social/commit/8ea21de21f7e0ae3e4c77c6037b78454995863c2))
- enhance user interface and permissions management with new routes and loading states ([55c6237](https://github.com/dimadev01/club-social/commit/55c623780e65059e48070ce21132d464cbc46651))
- enhance user management ([7f23558](https://github.com/dimadev01/club-social/commit/7f23558a5c50b185e81cfcbdcfc73ba777fbd4d3))
- enhance user management with Prisma integration and repository pattern implementation ([bbf1a7e](https://github.com/dimadev01/club-social/commit/bbf1a7e4896687da6e8a002ae076a3dcf7e7ad30))
- expand pricing module with filtering options and UI enhancements for better data management ([c9a0b1e](https://github.com/dimadev01/club-social/commit/c9a0b1e8da153d0bd57fddca0601b461f700bbd8))
- implement aggregate root and entity patterns with domain events in the API ([430b714](https://github.com/dimadev01/club-social/commit/430b714bf5731d4a12c522808cc2876893617665))
- implement audit logs feature with paginated response and UI integration ([58c84d8](https://github.com/dimadev01/club-social/commit/58c84d8cc82a151cd115b1e8f6707e6ea2c6eca0))
- implement CreateDue2 use case and related entities for enhanced due management ([2ff99be](https://github.com/dimadev01/club-social/commit/2ff99bec74826f473dab66fcad8dea7800730673))
- implement dues and payments management module with CRUD operations ([6da7612](https://github.com/dimadev01/club-social/commit/6da7612d81cfe3c1ebdc8e5a3dea8a7d77a9dd0a))
- implement export functionality for dues, members, movements, and payments with CSV ([5d2c62c](https://github.com/dimadev01/club-social/commit/5d2c62cbd37038c4afdfb9c3a813c56fde0f9e32))
- implement feature flags for maintenance mode and integrate into API and web applications ([683f894](https://github.com/dimadev01/club-social/commit/683f894930e67c5b7b1a3e060ae33cdffd5e676c))
- implement member management module ([35b5653](https://github.com/dimadev01/club-social/commit/35b565339f7d68f8ea16053cc4893d655f3f2382))
- implement Member model with related CRUD operations ([6544de5](https://github.com/dimadev01/club-social/commit/6544de538b0819baf72e942ff83961ca423ea4b0))
- implement member search functionality with filtering and selection capabilities ([b5bcd8f](https://github.com/dimadev01/club-social/commit/b5bcd8f0d6557596cd12d48f32cd1556c1a38978))
- implement movement and payment statistics features with new API ([e9e5d5a](https://github.com/dimadev01/club-social/commit/e9e5d5a924d79c0024ed3a4e2bbed466a5ade887))
- implement payment due status management ([d525847](https://github.com/dimadev01/club-social/commit/d525847c3c93be91c6ac1c5292520797a248598f))
- implement payment statistics feature with API integration and UI components ([901d66e](https://github.com/dimadev01/club-social/commit/901d66ed3d4db61e4c536528daa8c932f86a67ee))
- implement user creation and pagination with DTOs and Swagger integration ([bf2c05b](https://github.com/dimadev01/club-social/commit/bf2c05b07ca1e34af704ee984c6cc5f800d8b5e4))
- implement user management use cases and domain entities ([8291742](https://github.com/dimadev01/club-social/commit/82917421f5310d135dea655d760fa16fb7c1ba6c))
- implement user profile management ([7388e78](https://github.com/dimadev01/club-social/commit/7388e78da1dc6676c070f158525f00f49a7c9c5c))
- implement user retrieval endpoint and refactor routing for users ([cf9c35c](https://github.com/dimadev01/club-social/commit/cf9c35cb3e4e6f517b6403246fecc03b94a74778))
- integrate @itgorillaz/configify for configuration management ([3be7f2d](https://github.com/dimadev01/club-social/commit/3be7f2de06897e0afa76f6887b043759c9672104))
- integrate @logtail/pino for enhanced logging ([a5085b4](https://github.com/dimadev01/club-social/commit/a5085b42d7187e57c879db59e38df7cd8222cf06))
- integrate Ant Design components and update styling ([5418440](https://github.com/dimadev01/club-social/commit/541844087a217f380f4d51d45456c87ffad0d91b))
- integrate audit logging functionality with new AuditLog model and related updates ([aabea9b](https://github.com/dimadev01/club-social/commit/aabea9bde8eff93c423c8950004927d7dcbb53a9))
- integrate Auth0 for authentication ([6b992e5](https://github.com/dimadev01/club-social/commit/6b992e52a9fc1db0856711f33c6c0dbd8d966402))
- integrate better-auth for authentication ([dec7252](https://github.com/dimadev01/club-social/commit/dec7252f612d4f58b650cf4dae0e8b0487d215ee))
- integrate email services with Nodemailer and Resend ([7952002](https://github.com/dimadev01/club-social/commit/79520024b1acbd5a1c05e2877dc95dc0c4bb0dc3))
- integrate event-driven architecture with DomainEvent and DomainEventPublisher ([594516b](https://github.com/dimadev01/club-social/commit/594516b7317593fe150a3481bbc62e99cca7cdba))
- integrate logging and tracing with Logtail and Winston in the API ([7040989](https://github.com/dimadev01/club-social/commit/7040989666106655bdc2681dbcc7c4edd6605dac))
- integrate member category into due management and enhance UI with improved layout ([1e6328f](https://github.com/dimadev01/club-social/commit/1e6328f5dbe772d20b566f2a0d63bfa0316f495a))
- integrate Prisma for database management and add configuration for environment variables ([fd12b47](https://github.com/dimadev01/club-social/commit/fd12b473b9182fac98b841ea2116495109b90004))
- integrate Redis and BullMQ for email processing ([53792d5](https://github.com/dimadev01/club-social/commit/53792d5501f36a2fb0daf537a1530255fe62bf55))
- integrate Sentry for error tracking and performance monitoring in the API ([881584c](https://github.com/dimadev01/club-social/commit/881584c7106e600038207bc82f44f8a7223d8706))
- integrate Supabase for user management and enhance configuration with Supabase settings ([50992cc](https://github.com/dimadev01/club-social/commit/50992cc42f5b44ffacc88d63cab271a9a5f74a96))
- introduce DateRange value object for precise date filtering ([4fc4927](https://github.com/dimadev01/club-social/commit/4fc49271647b345b35b74a87a3bfca4cfa50b0d5))
- introduce member ledger functionality ([2bc3418](https://github.com/dimadev01/club-social/commit/2bc3418dbe64c37b4080a393e323dc8b9ba41ffa))
- introduce movement mode functionality and update related models, mappers, and UI components ([6b7cedb](https://github.com/dimadev01/club-social/commit/6b7cedb5a604ec7692164b8602afdeb0b2c8adf3))
- introduce movement read models and refactor repository methods to utilize new structures ([02b4ff1](https://github.com/dimadev01/club-social/commit/02b4ff1e12b5ae873899226e241eec9f3d9a477d))
- introduce Movements module for managing financial movements ([2c7311b](https://github.com/dimadev01/club-social/commit/2c7311b8cd5fce10e8148d25acad9262cbd4b41a))
- introduce pricing module with CRUD operations, event handling, and database integration ([74f44a4](https://github.com/dimadev01/club-social/commit/74f44a466ff8b9e21fb62fc69eb3f4be549317d3))
- introduce role management in User model, update related services and repositories ([cb21a2f](https://github.com/dimadev01/club-social/commit/cb21a2f95685139f966b3999c0f6d9bf031fd157))
- introduce sorting and pagination enhancements across dues and members management ([e93cd98](https://github.com/dimadev01/club-social/commit/e93cd9822fc3612c9ba5708c2e31d3ba45830fa6))
- refactor dues and payments structure by introducing due settlements ([ab9e587](https://github.com/dimadev01/club-social/commit/ab9e587c529a7389a255089325a137857b107630))
- refactor payment management ([f82cf71](https://github.com/dimadev01/club-social/commit/f82cf7171105a5dd0521c3940eeb109cca993985))
- refactor user authentication and management with better-auth integration ([603261b](https://github.com/dimadev01/club-social/commit/603261b200b500447b01334a88551b575a2fb817))
- update dependencies and add Jest configuration for API testing ([6667aa2](https://github.com/dimadev01/club-social/commit/6667aa24bcd2f50646dc0eed7a833a8a998af9cf))
- update due filtering and DTOs to include user status and improve pagination ([32dcf82](https://github.com/dimadev01/club-social/commit/32dcf827429425f016ca6742758a0d6358e378ac))
- update environment configuration and enhance config schema with Better Stack ([d295031](https://github.com/dimadev01/club-social/commit/d29503186ef4feef720e0d7ee3d3b26a699e54d3))
- update member and payment management ([96d74fe](https://github.com/dimadev01/club-social/commit/96d74fefdea9a390f0c5b6f59701295cc0569031))
- update user management and authentication configurations with better-auth integration ([ff3b023](https://github.com/dimadev01/club-social/commit/ff3b023c792daa79a4a1c557e8feb33d4ac9fe80))
- update user management with new update functionality, refactor user-related services ([5b16928](https://github.com/dimadev01/club-social/commit/5b16928579e4f1e96d98fd26caf725717e41c5a8))
- update user repository to use Supabase, enhance ESLint configuration, and add new dependencies ([7c54ba7](https://github.com/dimadev01/club-social/commit/7c54ba7fb6f853d16522161936a56297ef3afaa6))

### Bug Fixes

- correct production start script path in API package.json ([407e569](https://github.com/dimadev01/club-social/commit/407e569fbe0dcb3a4028c2c0e86a010d556228e7))
- correct production start script path in API package.json ([b52f5e3](https://github.com/dimadev01/club-social/commit/b52f5e31e2d6306bd423fd47aa2ab9375f30a030))
