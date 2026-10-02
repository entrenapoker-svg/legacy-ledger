/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/legacy_ledger.json`.
 */
export type LegacyLedger = {
  "address": "GXWfB5gTPxMLDSAeeYQ3e8TZmZMqpTzfFR3yEiUuBAaM",
  "metadata": {
    "name": "legacyLedger",
    "version": "0.2.0",
    "spec": "0.1.0",
    "description": "Dead man's switch inheritance vaults for SPL tokens on Solana"
  },
  "instructions": [
    {
      "name": "claimInheritance",
      "discriminator": [
        250,
        34,
        9,
        63,
        155,
        43,
        165,
        249
      ],
      "accounts": [
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "will"
              }
            ]
          }
        },
        {
          "name": "heir",
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        },
        {
          "name": "heirIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createWill",
      "discriminator": [
        45,
        99,
        103,
        142,
        128,
        156,
        135,
        71
      ],
      "accounts": [
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "will"
              }
            ]
          }
        },
        {
          "name": "testator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        },
        {
          "name": "inactivityThresholdDays",
          "type": "u16"
        },
        {
          "name": "rules",
          "type": {
            "vec": {
              "defined": {
                "name": "willRule"
              }
            }
          }
        },
        {
          "name": "heirs",
          "type": {
            "vec": {
              "defined": {
                "name": "heir"
              }
            }
          }
        },
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositAsset",
      "discriminator": [
        107,
        93,
        89,
        87,
        226,
        203,
        154,
        19
      ],
      "accounts": [
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "will"
              }
            ]
          }
        },
        {
          "name": "vaultAsset",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  115,
                  115,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "from",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "testator",
          "writable": true,
          "signer": true,
          "relations": [
            "will"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "executeWill",
      "discriminator": [
        167,
        64,
        178,
        63,
        233,
        123,
        165,
        124
      ],
      "accounts": [
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "keeper",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        }
      ]
    },
    {
      "name": "heartbeat",
      "discriminator": [
        202,
        104,
        56,
        6,
        240,
        170,
        63,
        134
      ],
      "accounts": [
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "testator",
          "signer": true,
          "relations": [
            "will"
          ]
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeProtocol",
      "discriminator": [
        188,
        233,
        252,
        106,
        134,
        146,
        202,
        91
      ],
      "accounts": [
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "protocolFeeBps",
          "type": "u16"
        },
        {
          "name": "minInactivityDays",
          "type": "u16"
        },
        {
          "name": "maxRulesPerWill",
          "type": "u8"
        }
      ]
    },
    {
      "name": "pauseProtocol",
      "discriminator": [
        144,
        95,
        0,
        107,
        119,
        39,
        248,
        141
      ],
      "accounts": [
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "protocol"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "registerAsset",
      "discriminator": [
        21,
        80,
        155,
        149,
        117,
        207,
        235,
        16
      ],
      "accounts": [
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "will"
              }
            ]
          }
        },
        {
          "name": "vaultAsset",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  115,
                  115,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  116,
                  111,
                  107,
                  101,
                  110,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "testator",
          "writable": true,
          "signer": true,
          "relations": [
            "will"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        }
      ]
    },
    {
      "name": "unpauseProtocol",
      "discriminator": [
        183,
        154,
        5,
        183,
        105,
        76,
        87,
        18
      ],
      "accounts": [
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "protocol"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "updateRule",
      "discriminator": [
        229,
        35,
        14,
        144,
        71,
        94,
        89,
        68
      ],
      "accounts": [
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "testator",
          "signer": true,
          "relations": [
            "will"
          ]
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        },
        {
          "name": "ruleIndex",
          "type": "u8"
        },
        {
          "name": "newRule",
          "type": {
            "defined": {
              "name": "willRule"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawAsset",
      "discriminator": [
        78,
        193,
        207,
        125,
        63,
        193,
        129,
        12
      ],
      "accounts": [
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "will",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "willId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "will"
              }
            ]
          }
        },
        {
          "name": "vaultAsset",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  115,
                  115,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "to",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "testator",
          "signer": true,
          "relations": [
            "will"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "willId",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "protocol",
      "discriminator": [
        45,
        39,
        101,
        43,
        115,
        72,
        131,
        40
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    },
    {
      "name": "vaultAsset",
      "discriminator": [
        38,
        213,
        6,
        33,
        94,
        119,
        104,
        181
      ]
    },
    {
      "name": "will",
      "discriminator": [
        118,
        59,
        220,
        69,
        27,
        104,
        241,
        81
      ]
    }
  ],
  "events": [
    {
      "name": "heartbeatRecorded",
      "discriminator": [
        171,
        129,
        156,
        232,
        208,
        84,
        30,
        86
      ]
    },
    {
      "name": "inheritanceClaimed",
      "discriminator": [
        187,
        111,
        117,
        77,
        6,
        154,
        244,
        192
      ]
    },
    {
      "name": "protocolInitialized",
      "discriminator": [
        173,
        122,
        168,
        254,
        9,
        118,
        76,
        132
      ]
    },
    {
      "name": "protocolPauseChanged",
      "discriminator": [
        67,
        33,
        235,
        73,
        71,
        124,
        172,
        110
      ]
    },
    {
      "name": "ruleUpdated",
      "discriminator": [
        195,
        50,
        108,
        92,
        31,
        230,
        57,
        5
      ]
    },
    {
      "name": "vaultAssetDeposited",
      "discriminator": [
        18,
        150,
        239,
        3,
        120,
        37,
        125,
        121
      ]
    },
    {
      "name": "vaultAssetRegistered",
      "discriminator": [
        69,
        77,
        135,
        23,
        191,
        125,
        223,
        102
      ]
    },
    {
      "name": "vaultAssetWithdrawn",
      "discriminator": [
        70,
        59,
        155,
        164,
        72,
        58,
        76,
        100
      ]
    },
    {
      "name": "willCreated",
      "discriminator": [
        180,
        1,
        113,
        99,
        88,
        179,
        105,
        189
      ]
    },
    {
      "name": "willExecuted",
      "discriminator": [
        221,
        23,
        234,
        11,
        128,
        253,
        97,
        58
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidWillIdLength",
      "msg": "Invalid will id length"
    },
    {
      "code": 6001,
      "name": "invalidMetadataUriLength",
      "msg": "Invalid metadata uri length"
    },
    {
      "code": 6002,
      "name": "tooManyRules",
      "msg": "Too many rules for this will"
    },
    {
      "code": 6003,
      "name": "noRules",
      "msg": "Will must have at least one rule"
    },
    {
      "code": 6004,
      "name": "tooManyHeirs",
      "msg": "Too many heirs"
    },
    {
      "code": 6005,
      "name": "noHeirs",
      "msg": "Will must have at least one heir"
    },
    {
      "code": 6006,
      "name": "invalidInactivityThreshold",
      "msg": "Invalid inactivity threshold"
    },
    {
      "code": 6007,
      "name": "invalidProtocolFee",
      "msg": "Invalid protocol fee"
    },
    {
      "code": 6008,
      "name": "willAlreadyExecuted",
      "msg": "Will already executed"
    },
    {
      "code": 6009,
      "name": "willNotExecuted",
      "msg": "Will not executed yet"
    },
    {
      "code": 6010,
      "name": "inactivityPeriodNotMet",
      "msg": "Inactivity period not met"
    },
    {
      "code": 6011,
      "name": "unauthorizedTestator",
      "msg": "Unauthorized: only the testator can do this"
    },
    {
      "code": 6012,
      "name": "unauthorizedAdmin",
      "msg": "Unauthorized: only the admin can do this"
    },
    {
      "code": 6013,
      "name": "heirNotFound",
      "msg": "Heir index out of range"
    },
    {
      "code": 6014,
      "name": "unauthorizedHeir",
      "msg": "Unauthorized: signer is not the heir for this index"
    },
    {
      "code": 6015,
      "name": "heirAlreadyClaimed",
      "msg": "Heir already claimed"
    },
    {
      "code": 6016,
      "name": "invalidRuleIndex",
      "msg": "Invalid rule index"
    },
    {
      "code": 6017,
      "name": "ruleConditionNotMet",
      "msg": "Rule condition not met"
    },
    {
      "code": 6018,
      "name": "unsupportedRuleType",
      "msg": "Rule type not supported by this build"
    },
    {
      "code": 6019,
      "name": "invalidDateTrigger",
      "msg": "Date trigger must be in the future"
    },
    {
      "code": 6020,
      "name": "duplicatePriority",
      "msg": "Rule priority must be unique"
    },
    {
      "code": 6021,
      "name": "invalidHeirConfig",
      "msg": "Invalid heir configuration"
    },
    {
      "code": 6022,
      "name": "allocationMismatch",
      "msg": "Heir allocations must total exactly 10000 bps"
    },
    {
      "code": 6023,
      "name": "invalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6024,
      "name": "vaultAssetMismatch",
      "msg": "Vault asset mismatch"
    },
    {
      "code": 6025,
      "name": "invalidVaultTokenAccount",
      "msg": "Vault token account does not belong to this vault"
    },
    {
      "code": 6026,
      "name": "vaultEmpty",
      "msg": "Vault holds no assets to distribute"
    },
    {
      "code": 6027,
      "name": "zeroAmount",
      "msg": "Deposit amount must be greater than zero"
    },
    {
      "code": 6028,
      "name": "invalidRemainingAccounts",
      "msg": "Expected remaining accounts in groups of three (vault asset, vault tokens, heir tokens)"
    },
    {
      "code": 6029,
      "name": "remainingAccountNotWritable",
      "msg": "Remaining account must be writable: pass it with isWritable=true"
    },
    {
      "code": 6030,
      "name": "protocolPaused",
      "msg": "Protocol is paused"
    },
    {
      "code": 6031,
      "name": "protocolNotPaused",
      "msg": "Protocol is not paused"
    },
    {
      "code": 6032,
      "name": "insufficientVaultBalance",
      "msg": "Vault holds less than the requested amount"
    },
    {
      "code": 6033,
      "name": "mathOverflow",
      "msg": "Arithmetic overflow"
    }
  ],
  "types": [
    {
      "name": "actionType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "distributeToHeirs"
          }
        ]
      }
    },
    {
      "name": "allocationTarget",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "percentageBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "heartbeatRecorded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "testator",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "heir",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "allocationBps",
            "type": "u16"
          },
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "claimedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "inheritanceClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "heir",
            "type": "pubkey"
          },
          {
            "name": "heirIndex",
            "type": "u8"
          },
          {
            "name": "heirName",
            "type": "string"
          },
          {
            "name": "allocationBps",
            "type": "u16"
          },
          {
            "name": "assetsClaimed",
            "type": "u8"
          },
          {
            "name": "totalBaseUnits",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "protocol",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "protocolFeeBps",
            "type": "u16"
          },
          {
            "name": "minInactivityDays",
            "type": "u16"
          },
          {
            "name": "maxRulesPerWill",
            "type": "u8"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "totalWills",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "protocolInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "protocol",
            "type": "pubkey"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "protocolFeeBps",
            "type": "u16"
          },
          {
            "name": "minInactivityDays",
            "type": "u16"
          },
          {
            "name": "maxRulesPerWill",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "protocolPauseChanged",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "protocol",
            "type": "pubkey"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "ruleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "inactivity"
          },
          {
            "name": "dateTrigger",
            "fields": [
              {
                "name": "timestamp",
                "type": "i64"
              }
            ]
          },
          {
            "name": "priceAbove",
            "fields": [
              {
                "name": "feedId",
                "type": "string"
              },
              {
                "name": "threshold",
                "type": "u128"
              }
            ]
          },
          {
            "name": "priceBelow",
            "fields": [
              {
                "name": "feedId",
                "type": "string"
              },
              {
                "name": "threshold",
                "type": "u128"
              }
            ]
          },
          {
            "name": "rebalance",
            "fields": [
              {
                "name": "targetAllocation",
                "type": {
                  "vec": {
                    "defined": {
                      "name": "allocationTarget"
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "ruleUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "ruleIndex",
            "type": "u8"
          },
          {
            "name": "oldRuleType",
            "type": "string"
          },
          {
            "name": "newRuleType",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "vaultAsset",
      "docs": [
        "One entry per SPL mint held by a will. `amount` is the authoritative",
        "token quantity; there is no stored USD valuation, because nothing on",
        "chain can price a basket of assets honestly."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "tokenAccount",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "vaultAssetDeposited",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "vaultTotal",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vaultAssetRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "tokenAccount",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vaultAssetWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "vaultTotal",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "will",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "testator",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "willId",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "rules",
            "type": {
              "vec": {
                "defined": {
                  "name": "willRule"
                }
              }
            }
          },
          {
            "name": "heirs",
            "type": {
              "vec": {
                "defined": {
                  "name": "heir"
                }
              }
            }
          },
          {
            "name": "inactivityThresholdDays",
            "type": "u16"
          },
          {
            "name": "lastHeartbeat",
            "type": "i64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "executedAt",
            "type": "i64"
          },
          {
            "name": "isExecuted",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "willCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "testator",
            "type": "pubkey"
          },
          {
            "name": "willId",
            "type": "string"
          },
          {
            "name": "inactivityThresholdDays",
            "type": "u16"
          },
          {
            "name": "heirCount",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "willExecuted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "will",
            "type": "pubkey"
          },
          {
            "name": "keeper",
            "type": "pubkey"
          },
          {
            "name": "satisfiedRuleIndexes",
            "type": "bytes"
          },
          {
            "name": "inactivityDeadline",
            "type": "i64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "willRule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ruleType",
            "type": {
              "defined": {
                "name": "ruleType"
              }
            }
          },
          {
            "name": "action",
            "type": {
              "defined": {
                "name": "actionType"
              }
            }
          },
          {
            "name": "priority",
            "type": "u8"
          },
          {
            "name": "enabled",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
