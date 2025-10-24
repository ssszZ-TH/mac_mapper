# Dev Ops

| **Summary Layer** | **Total Lines** |
|-------------------|-----------------|
| Docker | 97 |
| Database | 349 |
| Database Data CSV | 1347 |
| Backend | 2333 |
| Frontend | 6318 |
| **Total** | **10444** |

# Components

| **Summary Sub-Layer** | **Total Lines** |
|-----------------------|-----------------|
| Docker - Compose | 46 |
| Docker - Backend | 31 |
| Docker - Frontend | 20 |
| Database - Create | 228 |
| Database - Insert Mock | 121 |
| Database Data CSV | 1347 |
| Backend - Main Files | 114 |
| Backend - Schema | 355 |
| Backend - Model | 1694 |
| Backend - Controller | 1170 |
| Frontend - Components | 749 |
| Frontend - Contexts | 99 |
| Frontend - Pages | 4690 |
| Frontend - Services | 1049 |
| Frontend - Styles | 266 |
| Frontend - Utils | 37 |
| Frontend - Main | 110 |
| **Total** | **10444** |

# files

| **Layer** | **Sub-Layer** | **File/Folder** | **Lines** |
|-----------|---------------|-----------------|-----------|
| **Docker** | | | **97** |
| | | compose | 46 |
| | | backend | 31 |
| | | frontend | 20 |
| **Database** | | | **349** |
| | | create | 228 |
| | | insert mock | 121 |
| **Database Data CSV** | | | **1347** |
| | | communication_event_purpose_types | 5 |
| | | communication_event_status_types | 5 |
| | | communication_event | 6 |
| | | contact_mechanism_types | 6 |
| | | countries | 251 |
| | | gender_types | 4 |
| | | income_ranges | 7 |
| | | industry_types | 1013 |
| | | marital_status_types | 7 |
| | | organization_types | 9 |
| | | organizations | 6 |
| | | persons | 6 |
| | | racial_types | 8 |
| | | users | 19 |
| **Backend** | | | **2333** |
| | Main Files | | **114** |
| | | main | 69 |
| | | keygenerator | 8 |
| | | requirements | 11 |
| | | jwt_decode | 7 |
| | | jwt_encode | 10 |
| | | bcrypt_test | 9 |
| | Schema | | **355** |
| | | communication_event_history | 21 |
| | | communication_event_purpose_types | 18 |
| | | communication_event_status_types | 18 |
| | | communication_event | 35 |
| | | contact_mechanism_types | 18 |
| | | countries | 24 |
| | | gender_type | 18 |
| | | income_ranges | 18 |
| | | industry_types | 21 |
| | | marital_status_types | 18 |
| | | organization_history | 21 |
| | | organization_types | 18 |
| | | organization | 47 |
| | | person_history | 28 |
| | | person | 68 |
| | | racial_types | 18 |
| | | user | 34 |
| | | users_history | 18 |
| | Model | | **1694** |
| | | organization | 271 |
| | | person | 340 |
| | | user | 190 |
| | | communication_event_history | 33 |
| | | communication_event_purpose_types | 81 |
| | | communication_event_status_types | 79 |
| | | communication_event | 235 |
| | | contact_mechanism_types | 81 |
| | | countries | 91 |
| | | gender_type | 81 |
| | | income_ranges | 81 |
| | | industry_types | 87 |
| | | marital_status_types | 81 |
| | | organization_history | 31 |
| | | organization_types | 81 |
| | | person_history | 33 |
| | | racial_types | 81 |
| | | users_history | 29 |
| | Controller | | **1170** |
| | | auth | 54 |
| | | organization | 76 |
| | | person | 76 |
| | | user | 168 |
| | | communication_event_history | 37 |
| | | communication_event_purpose_types | 76 |
| | | communication_event_status_types | 76 |
| | | communication_event | 107 |
| | | contact_mechanism_types | 76 |
| | | countries | 76 |
| | | gender_type | 76 |
| | | income_ranges | 76 |
| | | industry_types | 76 |
| | | marital_status_types | 76 |
| | | organization_history | 37 |
| | | organization_types | 76 |
| | | person_history | 37 |
| | | racial_types | 76 |
| | | users_history | 37 |
| | | settings | 22 |
| | | database | 4 |
| **Frontend** | | | **6318** |
| | Components | | **749** |
| | | AddButton | 43 |
| | | CancelButton | 41 |
| | | DeleteButton | 41 |
| | | EeocButton | 45 |
| | | FavoriteButton | 16 |
| | | IncomeButton | 45 |
| | | IndustryButton | 45 |
| | | ListAllButton | 36 |
| | | ListFavoriteButton | 36 |
| | | ListInboxButton | 36 |
| | | ListSentButton | 36 |
| | | SaveButton | 41 |
| | | SizeButton | 45 |
| | | UpdateButton | 41 |
| | | AppBarCustom | 98 |
| | | DataTable | 52 |
| | | Loading | 34 |
| | | ProtectedRoute | 32 |
| | | Modal_id_des | 94 |
| | Contexts | | **99** |
| | | AuthContext | 46 |
| | | ThemeContext | 53 |
| | Pages | | **4690** |
| | | BasetypeAdminHome | 193 |
| | | HrAdminHome | 186 |
| | | OrganizationAdminHome | 186 |
| | | OrganizationUserHome | 182 |
| | | PersonUserHome | 182 |
| | | SystemAdminHome | 188 |
| | | UserDetail | 284 |
| | | Users | 126 |
| | | CommunicationEvent | 192 |
| | | CommunicationEventDetail | 403 |
| | | CommunicationEventHistory | 148 |
| | | OrganizationHistory | 127 |
| | | PersonHistory | 158 |
| | | UserHistory | 106 |
| | | OrganizationDetail | 462 |
| | | Organizations | 149 |
| | | PersonDetail | 691 |
| | | Persons | 180 |
| | | CommunicationEventPurposeType | 104 |
| | | CommunicationEventPurposeTypeDetail | 194 |
| | | CommunicationEventStatusType | 104 |
| | | CommunicationEventStatusTypeDetail | 194 |
| | | ContactMechanismType | 104 |
| | | ContactMechanismTypeDetail | 194 |
| | | Country | 108 |
| | | CountryDetail | 241 |
| | | GenderType | 104 |
| | | GenderTypeDetail | 194 |
| | | IncomeRange | 104 |
| | | IncomeRangeDetail | 194 |
| | | IndustryType | 106 |
| | | IndustryTypeDetail | 217 |
| | | MaritalStatusType | 104 |
| | | MaritalStatusTypeDetail | 194 |
| | | OrganizationType | 104 |
| | | OrganizationTypeDetail | 194 |
| | | RacialType | 104 |
| | | RacialTypeDetail | 194 |
| | | Login | 151 |
| | | BasetypeAdminProfile | 126 |
| | | HrAdminProfile | 126 |
| | | OrganizationAdminProfile | 126 |
| | | OrganizationUserProfile | 154 |
| | | PersonUserProfile | 192 |
| | | SystemAdminProfile | 126 |
| | | Register | 93 |
| | | RootPage | 47 |
| | Services | | **1049** |
| | | auth | 74 |
| | | CommunicationEvent | 121 |
| | | CommunicationEventHistory | 30 |
| | | communicationeventpurposetype | 57 |
| | | communicationEventStatusTypes | 57 |
| | | contactMechanismTypes | 57 |
| | | countries | 63 |
| | | genderTypes | 57 |
| | | incomeRanges | 57 |
| | | industryTypes | 60 |
| | | maritalStatusTypes | 57 |
| | | OrganizationHistory | 30 |
| | | organizations | 85 |
| | | organizationTypes | 57 |
| | | PersonHistory | 37 |
| | | persons | 106 |
| | | profile | 79 |
| | | racialTypes | 57 |
| | | UserHistory | 27 |
| | | users | 65 |
| | Styles | | **266** |
| | | theme | 266 |
| | Utils | | **37** |
| | | time_util | 37 |
| | Main | | **110** |
| | | main.tsx | 110 |

