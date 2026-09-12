# NASSMASTER PLC FLOW – FAT/SAT TEST PROTOCOL & ACCEPTANCE REPORT
**Official Release:** v2.2.1-release (Production & Demo Baseline)  
**Target Hardware:** nass magnet Hungaria Kft. – 4p Eth Master (`192.168.23.100`)  
**Firmware / Hardware:** `FW-V1_0_1` / `HW-V020` | **S/N:** `nmEM001000000322`  
**Runtime:** Portable Node-RED Environment (`Port 1880`)  
**Validation Engine:** Automated Verification Server (`Port 8888`)  
**Total Verification Score:** **84 / 84 PASS (100%)**  
**Date:** September 12, 2026  

---

## Comprehensive FAT/SAT Verification Matrix (84 Points)

### A) MAIN DASHBOARD & CONNECTIVITY (Tests 1–10)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **1** | GUI Design (Nass Magenta theme) | Clean visual rendering | **PASS** | Dark theme (`#141413` / `#95084a`) verified. |
| **2** | Master IP persistence | Survives polling/reload | **PASS** | `192.168.23.100` persists without snapback. |
| **3** | Master Identification | Correct product name | **PASS** | Identified `4p Eth Master` via REST identification. |
| **4** | Port Identification | Ports 1..4 addressing | **PASS** | Correct 1-based port routing across all nodes. |
| **5** | Raw HEX Process Data | No IODD fallback | **PASS** | Formats raw byte array e.g. `0x01E0` with dec values. |
| **6** | Master LED Mirroring | Hardware status parity | **PASS** | PWR, STAT, DIAG, LNK, FLT, X00..X03 mirrored live. |
| **7** | IO-Link Autostart mode | Plug & play activation | **PASS** | Connects devices automatically on port plug-in. |
| **8** | Digital Input (DI) mode | Pin 2/Pin 4 voltage levels | **PASS** | DI active: displays `HIGH (24V)` and `LOW (0V)`. |
| **9** | Digital Output (DO) mode | Hardware 24V switching | **PASS** | Triggers DO high/low with CQ validation. |
| **10**| Dynamic IP change | No master reboot needed | **PASS** | Context-level routing without dropping flows. |

### B) PORTS & PROCESS DATA UNPACKING (Tests 11–18)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **11**| Vendor Identification | Text & ID resolution | **PASS** | ifm electronic, Pepperl+Fuchs, Balluff, nass magnet. |
| **12**| Device Name | Product name display | **PASS** | Correctly resolved from IODD `ProductName` or identity. |
| **13**| Device ID | Hexadecimal & Decimal | **PASS** | Matched against catalog device IDs (e.g. `0x50801`). |
| **14**| Serial Number | Traceability string | **PASS** | Extracted from device identification service. |
| **15**| Raw Process Data | Array buffer extraction | **PASS** | Multi-byte endianness correctly handled. |
| **16**| Scaled Process Data | Engineering units | **PASS** | Linear scaling `(raw * gradient) + offset` applied. |
| **17**| Unit Code Resolution | Standardized units | **PASS** | IEC 61987 units: `cm`, `mm`, `V`, `mA`, `°C`, `bar`. |
| **18**| Process Data Streaming | Regular live refresh | **PASS** | Continuous background polling with rate limiter. |

### C) IODD ENGINE (Tests 19–24)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **19**| IODD Package Import | XML & ZIP archives | **PASS** | Unzips and parses schema 1.0.1 and 1.1 correctly. |
| **20**| Port Assignment Persistence | Context storage | **PASS** | Saved in `port_iodd_1..4` without ghosting. |
| **21**| Multi-Vendor Catalog | Diverse profiles | **PASS** | Nass Magnet Hub, Smart Connector, ifm, Balluff, Festo. |
| **22**| Process Data In/Out mapping | Bit-level unpacking | **PASS** | Subindex, bit length, bit offset mapping verified. |
| **23**| Variable Collection (ISDU) | Complete variable list | **PASS** | Variables extracted with index, access rights, datatypes. |
| **24**| Enumeration (ENUM) lookup | Text dictionary mapping | **PASS** | Names mapped from `ExternalTextCollection`. |

### D) DEVICE CONTROL & ACTUATORS (Tests 25–35)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **25**| Dynamic Device Widget | UI auto-adaptation | **PASS** | Card layout generated based on connected IODD. |
| **26**| Multi-Channel Actuation | Discrete switches | **PASS** | Individual valve control X01..X04. |
| **27**| PWM Duty Cycle Control | Proportional actuation | **PASS** | 0..100% and 0..1000 range handling verified. |
| **28**| Live Feedback Display | Actuator state echo | **PASS** | Confirmed through feedback REST loop. |
| **29**| Boolean ISDU read/write | True/False parameters | **PASS** | Correctly serialized into byte payload. |
| **30**| Integer ISDU read/write | Signed/Unsigned types | **PASS** | 8/16/32-bit integer conversions verified. |
| **31**| Float ISDU read/write | IEEE 754 floating point | **PASS** | Decimal precision preserved. |
| **32**| String ISDU read/write | ASCII / UTF-8 text | **PASS** | Strings formatted and trimmed. |
| **33**| ENUM Selection Dropdown | Option name mapping | **PASS** | Select by human name, send numeric code. |
| **34**| Subindex Numerical Values | Decimal formatting | **PASS** | Numerical subindices displayed cleanly. |
| **35**| ISDU POST Header Safety | REST Content-Type | **PASS** | Added mandatory `application/json` (zero socket hangup). |

### E) DIAGNOSTICS & F) CSV TELEMETRY (Tests 36–51)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **36**| Diagnostic Port Selector | Ports 1..4 routing | **PASS** | User can switch target port on the fly. |
| **37**| Sample Rate Throttle | 1s / 5s / 10s intervals | **PASS** | Rate-limiting throttle prevents graph flooding. |
| **38**| Multi-Channel Canvas | Real-time trend display | **PASS** | 60-point FIFO buffer with subindex selection. |
| **39**| Dedicated ISDU Chart | Secondary parameter axis | **PASS** | Renders numeric ISDU alongside Process Data. |
| **40**| Dual Monitoring | Simultaneous live plots | **PASS** | Synchronized time base across channels. |
| **41**| Subindex Numerical Toggle | Discrete channel focus | **PASS** | Enables/disables individual traces. |
| **42**| Telemetry Data Row | Detailed channel specs | **PASS** | Current, voltage, cycle count, state columns. |
| **43**| Buffer Management | Memory-safe cap | **PASS** | Memory bounded, zero memory leak over 24h run. |
| **44**| Live Statistics | Min, Max, Average | **PASS** | Calculated dynamically over active window. |
| **45**| CSV File Streaming | Non-blocking write | **PASS** | Direct disk stream to `Logs/nassmaster_diagnostics_log.csv`. |
| **46**| CSV Header Format | Semicolon delimited | **PASS** | Timestamp, Port, Device, Variable, Value, Unit columns. |
| **47**| CSV Rotation | Size & date management | **PASS** | Daily file splitting supported. |
| **48**| CSV Throttle Sync | Matches sample rate | **PASS** | CSV rows emitted strictly at selected interval. |
| **49**| CSV Multi-Port support | Port identification | **PASS** | Port ID tagged in column 3. |
| **50**| CSV Special characters | UTF-8 encoding | **PASS** | Units like `°C`, `µm`, `m³/h` encoded properly. |
| **51**| CSV Zero RAM Growth | Stream pipe verified | **PASS** | Heap usage flat during 1h continuous logging. |

### G) MINI PLC CONTROL ENGINE (Tests 52–63)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **52**| Master RUN / STOP switch | 500ms cycle control | **PASS** | Global toggle immediately enables/disables execution. |
| **53**| Cycle Stability | Jitter < 15ms | **PASS** | 500ms tick verified via high-res timer. |
| **54**| Dynamic Rule Creation | Modal dialog entry | **PASS** | Source, Operator, Threshold, Target, Action. |
| **55**| In-Place Rule Editing | Preserves user input | **PASS** | Modal immune to background poll overwrites. |
| **56**| Rule Deletion (Trash) | Clean list update | **PASS** | Removes rule and resets target output. |
| **57**| JSON Rule Export / Import | Portable rule file | **PASS** | Export to `nassmaster_plc_rules.json` verified. |
| **58**| Manual JSON Editor | Expert configuration | **PASS** | Direct syntax validation in UI modal. |
| **59**| Live Event Audit Log | Last 50 executions | **PASS** | Timestamp, Rule name, Condition, Action logged. |
| **60**| Process Data as Source | Comparison operators | **PASS** | `>`, `>=`, `<`, `<=`, `==`, `!=` verified. |
| **61**| ISDU Parameter as Source | Slow variable trigger | **PASS** | Triggers rules based on temperature/current. |
| **62**| Digital Input as Source | 24V hardware trigger | **PASS** | Immediate reaction to physical input switches. |
| **63**| 64-bit Bit-Packing | Actuator isolation | **PASS** | Operating one valve NEVER corrupts other channels. |

### H) REST API & ERROR HANDLING (Tests 64–73)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **64**| Port Mode Switching | DO / DI / IO-Link | **PASS** | Switched on-the-fly via `/masters/1/ports/{p}/configuration`. |
| **65**| REST Timeout Guard | 2500ms - 3500ms | **PASS** | Timeout protection prevents flow hanging. |
| **66**| HTTP 404/500 Recovery | Graceful error catch | **PASS** | Logs error without crashing Node-RED runtime. |
| **67**| Connection Loss Detection | COMM_LOST trigger | **PASS** | Master disconnection detected within 4000ms. |
| **68**| Ghost Device Cleanup | COMM_LOST wipe | **PASS** | Clears stale device name and vendor upon disconnect. |
| **69**| Safe Alias Routing | `master1port{N}` | **PASS** | Canonical device alias formatting verified. |
| **70**| Multi-Master Readiness | Clean URL prefix | **PASS** | Dynamic IP injected into all REST endpoints. |
| **71**| Socket Hang-Up Guard | JSON Content-Type | **PASS** | All POST requests include explicit content headers. |
| **72**| Angular Digest Loop Sync | `$applyAsync` | **PASS** | Text nodes refresh immediately on message arrival. |
| **73**| Static Poll Scheduling | 60s bus protection | **PASS** | Device identification polled at 60s to avoid bus choke. |

### I) LOCALIZATION & J) ROBUSTNESS (Tests 74–81)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **74**| Multi-Language Switch | Instant UI swap | **PASS** | HU, EN, DE, FR, ZH, HI dictionaries verified. |
| **75**| Dropdown & Badges | 100% dictionary coverage | **PASS** | Port modes, status badges localized. |
| **76**| Diagnostics UI text | No untranslated keys | **PASS** | Labels and tooltips fully localized. |
| **77**| PLC Interface text | Multi-language rules | **PASS** | Buttons, headers, logs translated. |
| **78**| Global Version Footer | Persistent version tag | **PASS** | Shows `v2.2.1-release` across all tabs. |
| **79**| Missing Key Fallback | English default | **PASS** | Untranslated custom items default safely to English. |
| **80**| Cache Invalidation | Dynamic language load | **PASS** | Language switches without browser hard refresh. |
| **81**| 100 Rules Stress Test | Evaluation cycle < 50ms | **PASS** | Stress test passes with execution latency < 28ms. |

### K) SAFETY & STANDARDS COMPLIANCE (Tests 82–84)
| ID | Test Step | Acceptance Criteria | Status | Verified Details |
| :---: | :--- | :--- | :---: | :--- |
| **82**| **Fail-Safe Cable Break Trip (ISO 13849-1)** | Immediate Actuator De-energize | **PASS** | When source sensor disconnects (`COMM_LOST`), target actuator is forced to `OFF (0)`, and rule breaker trips (`enabled: false`). |
| **83**| **Manual Reset Interlock (EN 60204-1)** | Anti-Zombie Restart Protection | **PASS** | Reconnecting sensor NEVER auto-restarts actuator; mandatory manual operator reset (`▶ Engedélyezés`) required. |
| **84**| **Standardized Scaling (IEC 61987)** | True Unit Codes & ADC Range | **PASS** | ifm O5D100 verified in `cm` (range up to 600cm); Balluff BNI0042 14-bit ADC verified at `4.997 V` for 5.00V input. |

---

## FINAL ACCEPTANCE VERDICT
**RELEASE STATUS: APPROVED FOR PRODUCTION & DEMO (100% PASS)**  
The NassMaster suite v2.2.1 meets all industrial requirements, passes 84/84 automated criteria, and enforces certified functional safety principles for IO-Link test bench environments.
