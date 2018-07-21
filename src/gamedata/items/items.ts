export interface ItemMod {
    description: string
}

export interface Item {
    id: string;
    name: string;
    requiredLevel?: number;
    requiredAttributes?: {
        strength?: number;
        dexterity?: number;
        intelligence?: number;
    };
    type: "BodyArmour" | "Ring" | "TwoHandedMace" | string;
    mods?: {
        implicit: ItemMod[];
        explicit: ItemMod[];
        crafted: ItemMod[];
    }
}

export interface ArmourItem extends Item {
    defence: {
        armour?: number;
        evasion?: number;
        energyShield?: number;
    }
}

export interface WeaponItemDamage {
    min: number;
    max: number;
}

export interface WeaponItem extends Item {
    damage: {
        physical?: WeaponItemDamage;
        fire?: WeaponItemDamage,
        cold?: WeaponItemDamage,
        lightning?: WeaponItemDamage,
        chaos?: WeaponItemDamage
    }
    criticalStrikeChance: number;
    attacksPerSecond: number;
    weaponRange: number;
}

export default [
    {
        id: "glorious-plate",
        name: "Glorious Plate",
        requiredLevel: 776,
        defence: {
            armour: 776
        },
        requiredAttributes: {
            strength: 191
        },
        type: "BodyArmour"
    },
    {
        id: "kaoms-heart-legacy",
        name: "Kaom's Heart (Legacy)",
        base: "glorious-plate",
        mods: {
            explicit: [
                {description: "Has no Sockets"},
                {description: "+1000 to maximum Life"}
            ]
        }
    },
    {
        id: "kaoms-heart",
        name: "Kaom's Heart",
        base: "glorious-plate",
        mods: {
            explicit: [
                {description: "Has no Sockets"},
                {description: "+500 to maximum Life"},
                {description: "(20-40)% increased Fire Damage"}
            ]
        }
    },
    {
        id: "brass-maul",
        name: "Brass Maul",
        requiredLevel: 27,
        requiredAttributes: {
            strength: 92
        },
        damage: {
            physical: {
                min: 34,
                max: 51
            }
        },
        criticalStrikeChance: 5,
        attacksPerSecond: 1.2,
        weaponRange: 11,
        type: "TwoHandedMace"
    },
    {
        name: "Geofri's Baptism",
        base: "brass-maul",
        mods: {
            explicit: [
                {description: "200% increased Physical Damage"},
                {description: "Adds 11 to 23 Cold Damage"},
                {description: "(10-20)% increased Stun Duration on Enemies"},
                {description: "Never Deal Critical Strikes"}
            ]
        }
    },
    {
        id: "two-stone-ring-cold-and-lightning",
        name: "Two-Stone Ring",
        requiredLevel: 20,
        mods: {
            implicit: [
                {description: "+(12-16)% to Cold and Lightning Resistances"}
            ]
        },
        type: "Ring"
    },
    {
        id: "bereks-grip",
        name: "Berek's Grip",
        base: "two-stone-ring-cold-and-lightning",
        mods: {
            explicit: [
                {description: "(25-30)% increased Cold Damage"},
                {description: "Adds 1 to (50-70) Lightning Damage to Spells and Attacks"},
                {description: "+(30-40) to maximum Life"},
                {description: "1% of Damage Leeched as Life against Shocked Enemies"},
                {description: "1% of Damage Leeched as Mana against Frozen Enemies"}
            ]
        }
    }
];