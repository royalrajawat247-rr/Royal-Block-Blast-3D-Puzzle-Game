import type { Language } from '../types/game';

export interface Translations {
  appName: string;
  appSubtitle: string;
  engineeredBy: string;
  playNow: string;
  resumeGame: string;
  startFresh: string;
  score: string;
  best: string;
  coins: string;
  combo: string;
  themeLightLabel: string;
  themeDarkLabel: string;
  themeSwitchToDark: string;
  themeSwitchToLight: string;
  langToggleLabel: string;
  shopAndStreak: string;
  newRewardAvailable: string;
  settingsAndInfo: string;
  soundOn: string;
  soundOff: string;
  hapticsOn: string;
  hapticsOff: string;
  home: string;
  restart: string;
  shopTitle: string;
  dailyStreakTitle: string;
  dayLabel: string;
  claimReward: string;
  claimedToday: string;
  streakInfo: string;
  blockStylesTitle: string;
  equipped: string;
  equip: string;
  unlockFor: string;
  notEnoughCoins: string;
  styleCrystalName: string;
  styleCrystalDesc: string;
  styleNeonName: string;
  styleNeonDesc: string;
  styleGoldName: string;
  styleGoldDesc: string;
  gameOverTitle: string;
  noMovesLeft: string;
  finalScore: string;
  newHighScore: string;
  reviveBoard: string;
  reviveAdPlaying: string;
  reviveUsed: string;
  reviveSubtitle: string;
  playAgain: string;
  adSlotLabel: string;
  adSlotReady: string;
  settingsTitle: string;
  audioAndTouch: string;
  appearanceAndLang: string;
  gameControls: string;
  resetBoardAction: string;
  resetBoardConfirm: string;
  supportHeading: string;
  supportTitle: string;
  supportDesc: string;
  supportEmailLabel: string;
  sendEmailAction: string;
  copyEmailAction: string;
  emailCopied: string;
  privacyTitle: string;
  privacyDesc: string;
  privacyBullets: string[];
  close: string;
  comboWords: {
    single: string;
    double: string;
    triple: string;
    royal: string;
    comboPrefix: string;
  };
  howToPlayHint: string;
  offlineBadge: string;
  totalLinesLabel: string;
  streakDaysCount: string;
}

const EN: Translations = {
  appName: 'Royal Block Blast',
  appSubtitle: '3D Arcade Gem Puzzle',
  engineeredBy: 'Engineered by RR Tech Labs',
  playNow: 'Play Game',
  resumeGame: 'Resume Match',
  startFresh: 'New Match',
  score: 'Score',
  best: 'Best',
  coins: 'Coins',
  combo: 'Combo',
  themeLightLabel: 'Royal Cosmic Temple',
  themeDarkLabel: 'Emerald Jungle Waterfall',
  themeSwitchToDark: 'Emerald Jungle',
  themeSwitchToLight: 'Cosmic Temple',
  langToggleLabel: 'हिंदी',
  shopAndStreak: 'Shop & Daily',
  newRewardAvailable: 'New Reward Available!',
  settingsAndInfo: 'Settings & Info',
  soundOn: 'Sound On',
  soundOff: 'Muted',
  hapticsOn: 'Vibration On',
  hapticsOff: 'Vibration Off',
  home: 'Home',
  restart: 'Restart',
  shopTitle: 'Coin Shop & Daily Streak',
  dailyStreakTitle: 'Daily Streak Rewards',
  dayLabel: 'Day',
  claimReward: 'Claim',
  claimedToday: 'Claimed Today',
  streakInfo: 'Play daily to earn escalating coin rewards for unlocking 3D gem styles.',
  blockStylesTitle: '3D Gem Block Styles',
  equipped: 'Equipped',
  equip: 'Equip',
  unlockFor: 'Unlock',
  notEnoughCoins: 'Need more coins',
  styleCrystalName: 'Glossy Crystal',
  styleCrystalDesc: 'Multi-faceted 3D royal sapphire, ruby, and emerald gem cubes.',
  styleNeonName: 'Neon Cyber',
  styleNeonDesc: 'Luminous 3D obsidian core with electric prism edge reflections.',
  styleGoldName: 'Gold Ingot',
  styleGoldDesc: 'Brushed 24k bullion blocks with inset royal gemstone facets.',
  gameOverTitle: 'No Valid Moves Left',
  noMovesLeft: 'Board is locked for the remaining pieces.',
  finalScore: 'Final Score',
  newHighScore: 'New High Score!',
  reviveBoard: 'Watch Ad (30s) to Revive Board',
  reviveAdPlaying: 'Sponsored Ad Playing',
  reviveUsed: 'Revive Used This Match',
  reviveSubtitle: 'Clears 3 rows to rescue your run',
  playAgain: 'Play Again',
  adSlotLabel: 'Sponsored Placement',
  adSlotReady: 'Adsterra 300×250 Container Ready',
  settingsTitle: 'Settings & Info',
  audioAndTouch: 'Audio & Haptics',
  appearanceAndLang: 'Scenic Theme & Language',
  gameControls: 'Match Controls',
  resetBoardAction: 'Reset Current Board',
  resetBoardConfirm: 'Tap again to confirm reset',
  supportHeading: 'Support & Privacy',
  supportTitle: 'RR Tech Labs • 24/7 User Support',
  supportDesc:
    'Built for reliable offline play on Android, iOS, and mobile browsers. Need help or want to suggest a feature? Message us directly:',
  supportEmailLabel: 'royalrajawat247@gmail.com',
  sendEmailAction: 'Email Support',
  copyEmailAction: 'Copy Email',
  emailCopied: 'Copied!',
  privacyTitle: '100% Offline • Zero Data Collection Privacy Policy',
  privacyDesc:
    'Your gameplay stays strictly on your device. No accounts, no tracking pixels, and no telemetry servers.',
  privacyBullets: [
    'Board progress, high scores, coins, and unlocked styles are saved exclusively in local device storage.',
    'Zero personal data, location, or device identifiers are collected or transmitted.',
    'Synthesized sound effects run locally via Web Audio API with zero external downloads.',
  ],
  close: 'Close',
  comboWords: {
    single: 'CRYSTAL CLEAR!',
    double: 'DOUBLE BLAST!',
    triple: 'TRIPLE ROYAL!',
    royal: 'ROYAL BLAST!',
    comboPrefix: 'COMBO',
  },
  howToPlayHint: 'Drag 3D gems onto the carved 8×8 grid. Fill rows or columns to shatter.',
  offlineBadge: '100% Offline',
  totalLinesLabel: 'Lines Cleared',
  streakDaysCount: 'Day Streak',
};

const HI: Translations = {
  appName: 'रॉयल ब्लॉक ब्लास्ट',
  appSubtitle: '3D आर्केड जेम पज़ल',
  engineeredBy: 'RR Tech Labs द्वारा निर्मित',
  playNow: 'गेम खेलें',
  resumeGame: 'मैच जारी रखें',
  startFresh: 'नया मैच शुरू करें',
  score: 'स्कोर',
  best: 'सर्वश्रेष्ठ',
  coins: 'कॉइन्स',
  combo: 'कॉम्बो',
  themeLightLabel: 'रॉयल कॉस्मिक टेंपल',
  themeDarkLabel: 'एमरल्ड जंगल वॉटरफॉल',
  themeSwitchToDark: 'एमरल्ड जंगल',
  themeSwitchToLight: 'कॉस्मिक टेंपल',
  langToggleLabel: 'English',
  shopAndStreak: 'शॉप और डेली',
  newRewardAvailable: 'नया रिवॉर्ड उपलब्ध!',
  settingsAndInfo: 'सेटिंग्स और जानकारी',
  soundOn: 'साउंड चालू',
  soundOff: 'म्यूट',
  hapticsOn: 'वाइब्रेशन चालू',
  hapticsOff: 'वाइब्रेशन बंद',
  home: 'होम',
  restart: 'रीस्टार्ट',
  shopTitle: 'कॉइन शॉप और डेली स्ट्रीक',
  dailyStreakTitle: 'डेली स्ट्रीक रिवॉर्ड्स',
  dayLabel: 'दिन',
  claimReward: 'क्लेम करें',
  claimedToday: 'आज का क्लेम पूरा',
  streakInfo: 'रोज़ खेलें और नए 3D जेम स्टाइल अनलॉक करने के लिए मुफ्त कॉइन्स जीतें।',
  blockStylesTitle: '3D जेम ब्लॉक स्टाइल्स',
  equipped: 'सक्रिय',
  equip: 'चुनें',
  unlockFor: 'अनलॉक करें',
  notEnoughCoins: 'पर्याप्त कॉइन्स नहीं',
  styleCrystalName: 'ग्लॉसी क्रिस्टल',
  styleCrystalDesc: 'चमकदार 3D रॉयल नीलम, रूबी और पन्ना जेम क्यूब्स।',
  styleNeonName: 'नियॉन साइबर',
  styleNeonDesc: 'चमकीला 3D कोर और इलेक्ट्रिक प्रिज्म बॉर्डर।',
  styleGoldName: 'गोल्ड इंगट',
  styleGoldDesc: '24K ब्रश्ड गोल्ड फिनिश और रॉयल रत्न कट फ्रेम।',
  gameOverTitle: 'कोई चाल बाकी नहीं',
  noMovesLeft: 'बचे हुए ब्लॉक्स के लिए बोर्ड पर जगह नहीं बची है।',
  finalScore: 'अंतिम स्कोर',
  newHighScore: 'नया हाई स्कोर!',
  reviveBoard: 'बोर्ड रिवाइव करने के लिए विज्ञापन देखें (30s)',
  reviveAdPlaying: 'स्पॉन्सर्ड विज्ञापन चल रहा है',
  reviveUsed: 'इस मैच में रिवाइव उपयोग हो चुका',
  reviveSubtitle: 'गेम जारी रखने के लिए 3 रो हटाएं',
  playAgain: 'फिर से खेलें',
  adSlotLabel: 'प्रायोजित स्थान',
  adSlotReady: 'Adsterra 300×250 कंटेनर तैयार',
  settingsTitle: 'सेटिंग्स और जानकारी',
  audioAndTouch: 'ऑडियो और हैप्टिक्स',
  appearanceAndLang: 'सीनिक थीम और भाषा',
  gameControls: 'मैच कंट्रोल',
  resetBoardAction: 'वर्तमान बोर्ड रीसेट करें',
  resetBoardConfirm: 'रीसेट की पुष्टि के लिए फिर टैप करें',
  supportHeading: 'सपोर्ट और प्राइवेसी',
  supportTitle: 'RR Tech Labs • 24/7 यूज़र सपोर्ट',
  supportDesc:
    'एंड्रॉइड, आईओएस और मोबाइल ब्राउज़र पर भरोसेमंद ऑफलाइन गेमिंग के लिए निर्मित। किसी भी सहायता या सुझाव के लिए सीधे ईमेल करें:',
  supportEmailLabel: 'royalrajawat247@gmail.com',
  sendEmailAction: 'ईमेल भेजें',
  copyEmailAction: 'ईमेल कॉपी करें',
  emailCopied: 'कॉपी हो गया!',
  privacyTitle: '100% ऑफलाइन • ज़ीरो डेटा कलेक्शन प्राइवेसी पॉलिसी',
  privacyDesc:
    'आपका गेमप्ले पूरी तरह आपके डिवाइस पर रहता है। कोई अकाउंट नहीं, कोई ट्रैकिंग नहीं।',
  privacyBullets: [
    'बोर्ड की स्थिति, हाई स्कोर, कॉइन्स और अनलॉक किए गए स्टाइल केवल आपके डिवाइस की लोकल स्टोरेज में सेव होते हैं।',
    'कोई भी व्यक्तिगत जानकारी, लोकेशन या डिवाइस आईडी एकत्र या भेजी नहीं जाती।',
    'साउंड इफेक्ट्स बिना किसी इंटरनेट डाउनलोड के सीधे Web Audio API से चलते हैं।',
  ],
  close: 'बंद करें',
  comboWords: {
    single: 'शानदार क्लियर!',
    double: 'डबल ब्लास्ट!',
    triple: 'ट्रिपल रॉयल!',
    royal: 'रॉयल ब्लास्ट!',
    comboPrefix: 'कॉम्बो',
  },
  howToPlayHint: '8×8 स्टोन ग्रिड पर 3D जेम्स खींचें। पूरी रो या कॉलम भरकर ब्लास्ट करें।',
  offlineBadge: '100% ऑफलाइन',
  totalLinesLabel: 'साफ़ की गई लाइन्स',
  streakDaysCount: 'दिन की स्ट्रीक',
};

export function getTranslations(lang: Language): Translations {
  return lang === 'hi' ? HI : EN;
}
