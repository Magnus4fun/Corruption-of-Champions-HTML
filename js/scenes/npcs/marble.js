MarbleScene = [];
//addToGameFlags(MARBLE_MET, MARBLE_ADDICTION, MARBLE_AFFECTION, MARBLE_WARNING, NO_MORE_MARBLE, MARBLE_RAPE_ATTEMPTED, MARBLE_FARM_TALK_LEVELS);


addToGameFlags(MARBLE_ADDICTION_LEVEL);
addToGameFlags(MARBLE_MET);
addToGameFlags(MARBLE_ADDICTION);
addToGameFlags(MARBLE_AFFECTION);
addToGameFlags(MARBLE_WARNING);
addToGameFlags(NO_MORE_MARBLE);
addToGameFlags(MARBLE_RAPE_ATTEMPTED);
addToGameFlags(MARBLE_FARM_TALK_LEVELS);

// TODO: DELETE (BC we use gameFlags instead) OR rewrite and start using!
MarbleScene.marbleStatusChange = function(affection, addiction, isAddicted) {
    if (isAddicted == undefined) isAddicted = -1;
    //Values only change if not brought to conclusion
    if (player.findPerk(PerkLib.MarblesMilk) < 0 && player.findPerk(PerkLib.MarbleResistant) < 0) {
        gameFlags[MARBLE_AFFECTION] += affection;
        gameFlags[MARBLE_ADDICTION] += addiction;
    }
    //if (isAddicted != -1) player.changeStatusValue(StatusEffects.Marble, 3, isAddicted);
}

MarbleScene.applyMarblesMilk = function() {
    //player.slimeFeed();
    var str = 5;
	var tou = 10;
	//Marble's milk - effect
	//Increases player toughness by 10 and strength by 5 for several hours (suggest 12).
	if(player.findStatusEffect(StatusEffects.MarblesMilk) < 0) {
		player.createStatusEffect(StatusEffects.MarblesMilk,12,0,0,0);
		if(player.str + 5 > 100) {
			str = 100 - player.str;
			if(str < 0) str = 0;
		}
		if(player.tou + 10 > 100) {
			tou = 100 - player.tou;
			if(tou < 0) tou = 0;
		}
		player.modStats("str", str,"tou", tou);
		
		player.changeStatusValue(StatusEffects.MarblesMilk,2,str);
		player.changeStatusValue(StatusEffects.MarblesMilk,3,tou);
	}
	else {
		player.addStatusValue(StatusEffects.MarblesMilk,1,12);
	}
	
	//Prevent duration from going to high.
	if(player.statusEffectValue(StatusEffects.MarblesMilk, 1) > 36) player.changeStatusValue(StatusEffects.MarblesMilk,1,36);
	//Remove withdrawl if applicable
	if(player.findStatusEffect(StatusEffects.MarbleWithdrawl) >= 0) {
		player.removeStatusEffect(StatusEffects.MarbleWithdrawl);
		player.modStats("tou", 5, "int", 5);
	}
	//The message for the effect wearing off varies depends on your addiction level.
	//If the player is addicted to her milk, they gain the withdrawal effect when it wears off, reducing player's inte and tou by 5
	//Gaining the effect while they are in withdrawal removes the effect.
	//The player becomes addicted when the addiction score crosses over 50 and they drink directly from Marble's teat, they remain addicted until it drops under 25.

}

//Intro Choices
MarbleScene.encounterMarbleInitially = function() {
	displaySprite("marble");
	clearOutput();
	gameFlags[MARBLE_MET] = 0.5;
	outputText("While exploring at Whitney's farm, you run across the furry southern belle almost immediately.  She looks like she has a job for you.<br><br>");
	outputText("Whitney tells you that one of her barn's residents, a cow-girl named Marble, is sore from overusing the milk machines.  She asks you to go and give the cow-girl a gentler touch from a living being.<br><br>");
	
	//(description of barn may need to be edited, I don't know what it's supposed to look like)
	outputText("You walk in to Whitney's barn and head over to a series of small rooms for the cow-girls.  You find Marble's room and knock on the door. A friendly earthy female voice calls out in response and invites you in.  Inside is a rather pleasant little room.  There are several shelves on the walls and a small sitting table in the corner with seating for two.  A large portion of the room is dominated by a large bed, the owner filling most of it.  Lastly, you notice a mini-dresser next to the bed.  The room's owner looks over at you and starts, \"<i>Oh, I've never met you before.</i>\"<br><br>As she gets up, you are given a chance to get a good look at her.  She is over six feet tall, with long brown hair tipped with two cow horns and a pair of cow ears in place of normal human ones.  Rounding out her relatively unchanged face are a pair of deep, brown eyes.  She is wearing only a short plain skirt, so you get a full frontal view of her two HH-cup assets. They look rather sore right now, with big red circles around her puffy nipples.  Her hands and arms appear mostly human save for thick-looking nails.  A soft 'clop' brings your eyes down to see that she is covered in thick, dark blond fur going from at least mid-way down her thighs to where a human's feet normally would be, in place of which are hooves.  A cow tail with a bow tied on it swings between her legs.<br><br>");
	
	//(if player height is under 5 feet)
	if(player.tallness < 60) {
		outputText("She looks down at you with a smile and says \"<i>Aww, you're so cute!  Did you come for my milk?  I'm always happy to give it, but since I'm kinda sore right now, you'll have to be gentle. Okay little one?</i>\"  She moves towards you and tries to pick you up.");
		//- player chooses resist or don't resist
		menu();
		//addButton(0, "Let Her", MarbleScene.marblePicksYouUpInitially);
        //addButton(1, "Don't", MarbleScene.resistMarbleInitially);
		return;
	}
	
	outputText("\"<i>My name's Marble, what's yours?</i>\" she asks you.  You introduce yourself and exchange a few pleasantries before she asks how she can help you.  You tell her that you actually came to help her, explaining that Whitney said she could use a gentle touch.  \"<i>Oh that would be nice</i>\", she says \"<i>Spending the night connected to the milking machine was a mistake, and now I need something gentle.</i>\"  How will you help her?");
	outputText("<br><br>(Of course, you could always turn around and resolve to avoid her from this point on, if you wanted.)");
	
	//- player chooses caress, suckle, rape, or leave
	menu();
	addButton(0, "Caress", MarbleScene.caressMarble);
	addButton(1, "Suckle", MarbleScene.suckleMarble);
	addButton(2, "Rape", MarbleScene.rapeMarbleInitially);
	addButton(14, "Leave", MarbleScene.turnOffMarbleForever);
}

MarbleScene.turnOffMarbleForever = function() {
	clearOutput();
	displaySprite("marble");
	gameFlags[MARBLE_WARNING] = 1;
	outputText("Considering the way the cow-girl lovingly cradles her hefty breasts as if they were the only things in the world, you decide you'd rather not get involved with her right now.  You inform her politely that Whitney must have been mistaken - there's nothing you can think to do that would help.  \"<i>Oh,</i>\" she says, surprised... and also nonplussed when she sees your reaction to her swollen jugs.  \"<i>Odd, but okay.  I guess I'll just lie back down then while you show yourself out.</i>\"");
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.caressMarble = function() {
	displaySprite("marble");
	clearOutput();
	outputText("You offer to gently rub her breasts, saying it should be a lot less painful than the milking machine's sucking.  \"<i>Oh no,</i>\" she retorts, \"<i>nothing is more wonderful than being sucked, but right now I guess I could use a break and get a good rub.</i>\"  You move around behind her and reach up under her arms, firmly grasping her breasts.  She gasps sharply at first, but as you start to gently massage and caress them, she lets out a sigh and starts breathing deeply.  You begin to feel milk leaking out onto your hands as you rub her.  \"<i>This is nice,</i>\" she says, \"<i>not as good as being suckled, but nice.</i>\"  After a few minutes of gently massaging her breasts, she pulls your hands off of them and turns to you. \"<i>Thanks,</i>\" she says, \"<i>I'm still a little sore, but thank you for your touch, sweetie.  Feel free to come back later; I'll be happy to visit with you any time.</i>\"  Just before you leave, you notice that Marble is rubbing her breasts the same way you were, a slight smile on her face.");
	player.modStats("lus", 15);
	gameFlags[MARBLE_AFFECTION] += 5;
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.suckleMarble = function() {
	displaySprite("marble");
	clearOutput();
	outputText("You suggest that you could gently suckle her breasts to make her feel better.  \"<i>That sounds wonderful!</i>\" she exclaims cheerfully, putting her hands under her ample mounds.  \"<i>There is nothing I love more than giving milk to living things.</i>\"");
	
	//[if player is under 5 feet tall]
	if(player.tallness < 60) outputText("Realizing you might have trouble reaching her breasts, you grab one of the chairs from the table.  ");
	outputText("You walk over to her and lean in to suck from her nipple.  Your mouth is soon filled with a delicious warm fluid, and you eagerly begin to gulp it down.  As you drink, you can hear Marble sighing softly above you. \"<i>Thank you, sweetie.  Could you put your mouth on the other teat too?</i>\"  She says after a few minutes. You eagerly comply, and just like before, the fluid fills your mouth. Her milk is easily the most delicious thing you've ever drunk, and not only that, drinking it from her breast just feels so right.  You hear Marble sigh again, but this time it turns into a moan.  Once you'd had enough, you slowly pull back. You feel very satisfied with your drink, and you can see that Marble is quite satisfied too.  She smiles at you and says \"<i>That was wonderful. You're welcome to come and visit any time.</i>\"  With that, the two of you part company. You feel an odd euphoria as you walk away from the barn.");
	//(increase affection by 15)
	//(increase addiction by 10)
	//marbleStatusChange(15,10);
	gameFlags[MARBLE_AFFECTION] += 15;
	gameFlags[MARBLE_ADDICTION] += 10;
	//(apply the stat effect 'Marble's Milk' to the player)
	MarbleScene.applyMarblesMilk();
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.rapeMarbleInitially = function() {
	displaySprite("marble");
	clearOutput();
	var rapeSuccesful = false;
	player.modStats("str", 100);
	
	outputText("You decide that rather than helping her, you are going to roughly manhandle her breasts and rape her.  You suddenly grab at her breasts and squeeze them roughly, at which point she screams and ");
	
	if(player.findPerk(PerkLib.Evade) >= 0)
	{
		outputText("tries to slap you.  You easily duck under her hand and start twisting her nipples.  She squeals and begins to go limp under your painful ministrations.  You move her around and force her to kneel, pushing her face down into her bed.  Keeping one of your hands on her nipple, you pull down her skirt and expose her beautiful womanhood and asshole.<br><br>", false);
		rapeSuccesful = true;
	} 
	else if(player.str >= 80) {
		outputText("slaps you.  Unperturbed by the hit, you push her back onto the edge of the bed, much to her dismay.  You forcibly flip her over onto her stomach and her knees hit the ground.  You keep one hand on her back to stop her from getting up and use your other to pull down her skirt, exposing her beautiful womanhood and asshole.<br><br>", false);
		rapeSuccesful = true;
	} 
	if(!rapeSuccesful) {
		outputText("slaps you.  While you are still reeling from the blow, she uses a surprising amount of strength to force you out the door.  She slams it behind you and yells, \"<i>Don't you ever come back!</i>\" through the door. You hear her start to cry as you walk away.  She seems to be much stronger than she looks. You think to yourself that if you see her again, you won't make the mistake of underestimating her. While lost in your thoughts, you stumble and accidentally fall over.  <i>Maybe you'll teach her a lesson once you've stopped seeing stars.</i>  As you try to get up, you stumble in the other direction and fall over again.  <i>Then again, it may not be worth the trouble.</i>", false);
	}
	
	//If Marble was overpowered
	if(rapeSuccesful) {
		//dicked players
		if(player.cocks.length > 0) {
			outputText("Chuckling to yourself, you free your " + player.multiCockDescriptLight() + " from your " + player.armor.longName + ".  You spend a moment to ask the helpless cow-girl if she is ready, her only response being a whimper, before ");
			//If player's main dick is less than 3 inches wide, ie would fit inside Marble
			if(player.cocks[0].cockThickness < 3) {
				//how far in does the player go?
				if(player.cocks[0].cockLength <= 8) {
					outputText("forcing your " + player.cockDescript(0) + " in as far as it will go.  ");
				} else 
				{
					outputText("forcing your " + player.cockDescript(0) + " in to the hilt.  ");
				}
				//the raping proper
				outputText("With a grunt of pleasure, you start to push in and out while simultaneously manhandling her sensitive breasts.  Her pained cries and squeals only make you hornier and the experience all the more enjoyable for you.  You laugh from the pleasure you're getting at the expense of her pain.  Slapping her ass and marvelling at how it jiggles, you quicken the pace of your thrusts inside her.  Marble gasps at the increased rate, alternating between tones of pleasure and pain.<br><br>", false);
				//is the player corrupt enough to get the fantasy?
				if(player.cor>=33) 
					MarbleScene.MarbleScene.marbleRapeCorruptFantasy();
				outputText("You taunt her one more time before feeling your body get racked by an orgasm and you blow your load inside her.  ");
				//set player's lust to 0
				player.orgasm();
			}
			//now if the player doesn't fit
			else {
				outputText("attempting to push your " + cockDescript(0)  + " inside her.  Of course, the girth of your " + cockDescript(0)  + " makes this a rather difficult operation, and it becomes clear after a few moments that it just isn't going to fit.  Instead, you contend yourself by rubbing yourself between her ample ass cheeks, occasionally stroking your " + multiCockDescriptLight() + " in pride.<br><br>");
				//is the player corrupt enough to get the fantasy?
				if(player.cor>=33) 
					MarbleScene.marbleRapeCorruptFantasy();
				outputText("You taunt her one more time before feeling your body get racked by an orgasm and you blow your load onto her ass.  ");
				//set player's lust to 0
				player.orgasm();
			}
		}
		//dickless girls
		else if(player.vaginas.length > 0) {
			outputText("You take a quick look around the room to see if you can find something to make this more enjoyable, and notice a double dildo laying on the end table.  You grab the tool and push it into Marble's womanhood, causing a small gasp of pleasure from her that turns into one of pain as you twist one of her nipples.<br><br>");
			outputText("Keeping Marble in place, you get your " + vaginaDescript(0) + " ready to take in the other end of the dildo before doing so with gusto.  Much to Marble's discomfort, you manipulate the dildo in ways to heighten your own pleasure but give Marble a less enjoyable experience.  You ask her if she likes it, to which she responds with a whine and an attempt to move into a more comfortable position.  You tighten your grip on her, and she freezes again.<br><br>");
			//is the player corrupt enough to get the fantasy?
			if(player.cor>=33)
				MarbleScene.marbleRapeCorruptFantasy();
			outputText("You taunt her one more time before feeling your body get racked by a satisfying orgasm from using Marble's own toy against her.  ");
			//set player's lust to 0
			player.orgasm();
		}
		//the genderless option
		else {
			outputText("Your lack of genitals makes it difficult to actually rape Marble, but there are other things you can do.  With your free hand, you push one of your fingers into her womanhood, causing Marble to squeal as you start wriggling it around.  Of course, that's just the beginning, as soon there are two fingers in there, and then three.  As each one goes in, there is another gasp from Marble.  You pinch her nipples as your fourth goes in, pulling out a rather interesting gasp of both pain and pleasure.<br><br>");
			//is the player corrupt enough to get the fantasy?
			if(player.cor >= 33) 
				MarbleScene.marbleRapeCorruptFantasy();
			outputText("With just one more thing to do, you laugh at Marble before shoving your full fist inside her.  The act results in that familiar gasp of pain and pleasure.  Playing with her is indeed quite satisfying.  ");
			//Reduce player lust by 20
			dynStats("lus", -20);
		}
		//wrapping things up
		outputText("You close your eyes and revel in the moment before feeling Marble roll over and grab one of your hands.  You open your eyes just in time to see a big hammer-head flying towards your face...  ");
		//The player is knocked out, Set player health to 0
		player.changeHP(-9001, false);
		player.HP = 1;
		//Pass several hours
		outputText("<br><br>You wake up a few hours later laying on the ground, your head feeling like it's been squeezed in a vice.  With some effort, you manage to get yourself to a sitting position and look around.  It looks like you're laying just outside the barn.  Whitney is standing nearby.  She has something akin to a smile on her animalistic face as she tells you: \"<i>Well hun, it seems you've managed to get Marble rather upset.  I reckon you should leave her alone from now on, as I'm sure you've found out the hard way, she is one tough customer.</i>\"  Your aching head is telling you that may be a good idea; but then again, maybe you should teach that cow-girl a lesson for the pain first.");
	}
	doNext(Camp.returnToCampUseFourHours);
	//The follow up fight event can now be triggered, regardless of whether the rape was successful or not.
	gameFlags[MARBLE_RAPE_ATTEMPTED] = 1;

}

MarbleScene.marbleAfterRapeBattle = function () {
	displaySprite("marble");
	outputText("While exploring the farm, you notice the cow-girl that hit you earlier, Marble, coming out of the barn.  You could try confronting her if you want to, or you could just avoid her from now on.");
	//player decides if they want to confront her or not
	//Choose yes/no
	doYesNo(MarbleScene.marbleAfterRapeYes, MarbleScene.marbleAfterRapeNo);
}

MarbleScene.marbleAfterRapeYes = function() {
	displaySprite("marble");
	//If choice was yes 
	outputText("<br><br>Deciding to deal with her, you move towards the barn.  However, Marble spots you on your way over and quickly disappears inside.  Just as you get to the entrance, she re-emerges with a large two handed hammer in hand.  \"<i>Leave right now, or this hammer is going into your head,</i>\" she tells you with an angry look in her eyes and drops into a combat stance.  Will you fight her?");
	//the player decides if they want to fight or not
	//Choose yes/no
	doYesNo(MarbleScene.marbleAfterRapeStartFight, MarbleScene.marbleAfterRapeNo);
}

MarbleScene.marbleAfterRapeStartFight = function() {
	displaySprite("marble");
	outputText("You drop into your own combat stance; it's time to get even with her for last time.  ");
	//Do battle with Marble
	startCombat(new Marble(),true);
}

MarbleScene.marbleAfterRapeNo = function() {
	displaySprite("marble");
	outputText("You shake your head. It's just not worth the headache to deal with this cow.  You turn around and leave; you aren't going to be seeing her anymore.");
	doNext(Camp.returnToCampUseOneHour);
}


MarbleScene.marbleRapeCorruptFantasy = function() {
	displaySprite("marble");
	outputText("Marble is helpless before your onslaught with your superior position, and you find it immensely enjoyable to have someone trapped under you like this.  You start to fantasize just what it would be like if everyone were like this to you, just from being in your presence.  You imagine a sea of asses and pussies all stuck up in the air for you to rape at your leisure, and none of the owners able to do a damn thing about it.<br><br>");
	//do they really want to have this fantasy?  How far are they gone?
	if(player.cor>=66) {
		outputText("You shake your head, clearing the bizarre fantasy from your mind and returning to the more immediate enjoyment.<br><br>");
	} 
	else {
		outputText("You smile to yourself and think, \"<i>One day,</i>\" before returning to the more immediate enjoyment.<br><br>");
}
}

// After intro Scenes
MarbleScene.meetMarble = function() {
	var marbling = 0;
	// Pre-addiction events(explore events take 1 hour, working ones take 3)
	if(gameFlags[MARBLE_ADDICTION_LEVEL] == 0) {
		if(gameFlags[MARBLE_FARM_TALK_LEVELS] >= 7) MarbleScene.encounterMarbleExploring();
		else MarbleScene.encounterMarbleExploring2();
	}
	// After-addiction events
	else {
		// Resistant to addiction
		if(player.findPerk(PerkLib.MarbleResistant) >= 0) {
			// MarbleScene.postAddictionFarmExplorings(); TODO
			return;
		}
		// Not resistant to addiction
		// Happy
		if (gameFlags[MARBLE_ADDICTION_LEVEL] == 1){
			if(plater.findStatusEffect(StatusEffect.MarbleWithdrawl) >= 0) marbling = 0;
			else marbling = 1;
			if (marbling == 0) MarbleScene.encounterAddictedHappy();
			else MarbleScene.encounterAddictedNonWithdrawlHappy();
		}
		// Ashamed
		else {
			if(player.findStatusEffect(StatusEffects.MarbleWithdrawl) >= 0) marbling = 0;
			else marbling = 0;
			if(marbling = 0) MarbleScene.encounterAddictedAshamed();
			else MarbleScene.encounterAddictedNonWithdrawlAshamed();
		}
	}
}

MarbleScene.encounterMarbleExploring = function() {
	displaySprite("marble");
	clearOutput();
	outputText("While wandering around the farm, you meet the cow-girl Marble heading towards the barn.  ");
	// Greeting
	if(player.tallness < 60) outputText("Marble gives her customary greeting of hugging you to her breast before telling you that she is off to get milked at the barn.  ");
	else outputText("You exchange a quick greeting before Marble tells you that she is off to get milked at the barn.  ");
	
	// Low affection
	if(gameFlags[MARBLE_AFFECTION] < 30) {
		outputText("<br><br>It seems that she is looking forward to it and doesn't want to put it off to talk.  She hurries off and you're left to look around some more.  <b>Maybe if you got her to like you a little more while doing some work around the farm?</b>");
		doNext(Camp.returnToCampUseOneHour);
	}
	// High affection
	else {
		outputText("<br><br>\"<i>But, since you're here, maybe you could suckle me yourself?</i>\" she asks smiling.<br><br>");
		// Low Addiction
		if(gameFlags[MARBLE_ADDICTION] < 40) {
			outputText("<br><br>Do you drink her milk?");
			//player chooses yes/no
			doYesNo(MarbleScene.drinkMarbleMilk, MarbleScene.refuseMarbleMilk);
		}
		// High Addiction
		else {
			outputText("<br><br>You really want some of that milk and eagerly agree.<br><br>");
			doNext(MarbleScene.drinkMarbleMilk);
		}
	}
}

MarbleScene.drinkMarbleMilk = function() {
	displaySprite("marble");
	clearOutput();
	// Start drinking milk
	outputText("Beaming, Marble leads you back to her room and sits down on the bed.  She invites you onto her lap and lets you start sucking at one of her nipples.  The moment that wonderful taste meets your tongue, you start gulping down the milk with reckless abandon. She sighs in pleasure in response.  From time to time, Marble gets you to switch nipples, all the while gently stroking your head", false);
	//[player does not have human ears]
	if(player.earType != EARS_HUMAN) outputText(" and occasionally scratching behind your ears");
	outputText(".  ");
	outputText("Once you've had your fill, you pull back and the two of you smile at each other.  \"<i>It's really nice for you isn't it sweetie?  Nice for me too to have someone like you that can give a good suck on my itching nipples.</i>\"<br><br>");
	
	//Increase addiction by 10,
	gameFlags[MARBLE_ADDICTION] += 10;
	//if addiction is now over 50, skip straight to addiction event without doing anything else)
	if(gameFlags[MARBLE_ADDICTION] >= 50) {
		MarbleScene.marbleAddiction(false);
		//Increase affection
		gameFlags[MARBLE_AFFECTION] += 8
		MarbleScene.applyMarblesMilk();
		return;
	}
	//Increase affection
	gameFlags[MARBLE_AFFECTION] += 8
	
	//(apply Marble's Milk status effect)
	MarbleScene.applyMarblesMilk();
	
	//Change stats
	player.changeHP(10);
	player.changeFatigue(-20);
	player.modStats("lib", 1, "lus", 20);
	// Trigger milk sex scene if high lust
	if(player.lust > 60) {
		MarbleScene.marbleMilkSex(false);
		doNext(Camp.returnToCampUseOneHour);
		return;
	}
	
	// After drinking milk
	outputText("After drinking Marble's milk, a feeling of euphoria spreads through you as you leave the farm in high spirits.");
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.refuseMarbleMilk = function() {
	displaySprite("marble");
	outputText("<br><br>Taken aback by your refusal, she gives an annoyed hurumph before continuing on her way to the barn. You shake your head and return to your explorations.");
	
	// Reduce lust, affection, and addiction
	player.modStats("lus", -10);
	gameFlags[MARBLE_AFFECTION] -= 5
	gameFlags[MARBLE_ADDICTION] -= 5
	
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.encounterMarbleExploring2 = function() {
	displaySprite("marble");
	clearOutput();
	outputText("You decide to pay Marble a visit at her room.  ", false);
	
	// Player is small
	if(player.tallness < 60) outputText("As you step into her room, she eagerly rushes over and hugs you to her breast. \"<i>You're as cute as ever, sweetie!</i>\"  ");
	
	outputText("She is happy to see you and treats you to a small meal while you have a pleasant chat.  ");
	if(gameFlags[MARBLE_FARM_TALK_LEVELS] < 7) {
		MarbleScene.extendedFarmTalk();
		doNext(Camp.returnToCampUseOneHour);
		return;
	}
	else outputText("While you talk mostly about unimportant things, there is some discussion about the world and the dangers within.");
	
	// Above 30 addiction
	if(gameFlags[MARBLE_ADDICTION] > 30) {
		outputText("<br><br>The entire time you spend talking, you find yourself oddly attracted to Marble's scent, especially when you get an odd whiff of her milk.  ");
		player.modStats("lus", 10);
	}
	// Under 60 affection
	if(gameFlags[MARBLE_AFFECTION] < 60) {
		outputText("<br><br>After the pleasant interlude to your quest, you bid farewell to the pretty cow-girl and return to your camp.");
		// Increase affection
		gameFlags[MARBLE_AFFECTION] += 3;
		// Increase Int
		if(player.inte < 30) player.modStats("int", 4);
		else if(player.inte < 40) player.modStats("int", 2);
		else if(player.inte < 60) player.modStats("int", 1);
		doNext(Camp.returnToCampUseOneHour);
	}
	// Over= 60 affection
	else {
		// Haven't had sex with Marble yet
		if(player.findStatusEffect(StatusEffect.FuckedMarble) < 0) {
			outputText("<br><br>As the two of you finish chatting, Marble gives you an intense look.  \"<i>You know that I really like you right, sweetie?  I'd like it if I can do something special with you,</i>\" she hesitates for a moment, \"<i>Will you come to my bed?</i>\"<br><br>Do you accept her invitation?");
			// Increase lust
			player.modStats("lus", 10);
			doYesNo(MarbleScene.AcceptMarblesSexualAdvances, MarbleScene.turnDownMarbleSexFirstTime);
		}
		// Have had sex with Marble
		else {
			outputText("<br><br>After you finish talking, Marble gives you another intense look.  \"<i>Sweetie, will you come into my bed again?</i>\" You can feel a tingle in your groin at the thought of having sex with her again.<br><br>Do you accept her invitation?");
			//player chooses yes/no
			player.modStats("lus", 10);
			doYesNo(MarbleScene.AcceptMarblesSexualAdvances, MarbleScene.turnDownMarbleSexRepeat);
		}
	}
}

MarbleScene.turnDownMarbleSexFirstTime = function() {
	displaySprite("marble");
	clearOutput();
	outputText("She stares at you for a few moments as your refusal sinks in.  \"<i>So you don't feel the same way about me...  I'm sorry, I won't ever ask you again,</i>\" she says sadly.  \"<i>Maybe I'll see you later.</i>\" She directs you out the door.  You realize that refusing her will permanently affect your relationship.");
	//(affection drops to 50, it can no longer be raised above 50) TODO: FIND OUT HOW IT IS INFORCED
	gameFlags[MARBLE_AFFECTION] = 50;
	// Increase Int
	player.modStats("int", 4);
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.turnDownMarbleSexRepeat = function() {
	displaySprite("marble");
	clearOutput();
	outputText("She looks disappointed at your refusal but quickly brightens up and says, \"<i>Ok sweetie, next time then.</i>\" On that note, you bid farewell to the pretty cow-girl and return to your camp.");
	//Increase Int
	player.modStats("int", 1);
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.AcceptMarblesSexualAdvances = function() {
	displaySprite("marble");
	MarbleScene.standardSex(true); 
	// If first time sex, then create StatusEffect
	if(player.findStatusEffect(StatusEffects.FuckedMarble) < 0) player.createStatusEffect(StatusEffects.FuckedMarble,0,0,0,0);
	//(increase affection by 10)
	gameFlags[MARBLE_AFFECTION] += 10;
	//(increase player inte)
	player.modStats("int", 1);
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.extendedFarmTalk = function() {
	//--- First Conversation ---
	switch (gameFlags[MARBLE_FARM_TALK_LEVELS]) {
		case 0:
			outputText("During your talk, Marble asks where you're from.");
			//[if PC is human] 
			if(player.race() == "human") {
				outputText("  \"<i>The only other human I've ever met is that wandering trader Giacomo,</i>\" she tells you \"<i>but he doesn't really talk about himself.  Maybe you could tell me about humans?  I was wondering where they live and what kind of people they are.</i>\"");
				//[if PC is shorter then 5 feet] 
				if(player.tallness < 60) outputText("  Her eyes light up. \"<i>Are they all as cute as you?</i>\"");
				//[if PC is taller then 6'6" feet] 
				else if(player.tallness > 78) outputText("  \"<i>Are most of you this tall?</i>\"");
			}
			//[if PC is cow-girl/cowboi]
			else if(player.race() == "cow-morph" || player.race() == "cow-boy") {
				outputText("  \"<i>It's so nice to see another of my kind,</i>\" she tells you, \"<i>I haven't seen any since I left home.  Where are you from?</i>\"");
			}
			//[if PC is a dogmorph] 
			else if(player.race() == "dog-morph") outputText("  \"<i>I've seen lots of dog-morphs before, are you from Barkersvile?</i>\"");
			//[if PC is a centaur]
			else if(player.isTaur()) outputText("  \"<i>I've seen a few centaurs before, but they don't seem to have regular homes.  They're nomads, wandering the plains.  Are you the same?</i>\"");
			//[if PC is not human, cow-girl/cowboi, dogmorph, or centaur] 
			else outputText("  \"<i>It's very rare that we get a " + player.race() + " here.  Are you from around these parts?</i>\"");
			outputText("<br><br>You sigh and think back for a moment before answering her.");
			//[if PC is not human anymore] 
			if(player.race() != "human") outputText("<br><br>You start by explaining that you weren't born as what you appear to be; you were once a human.  Marble is surprised by this, but when you start to explain how you came to be what you are, she stops you.  \"<i>You don't need to tell me the power of some of the things in this world.  Mommy taught me how to find LaBova if I ever lose a part of my bovinity,</i>\" she says, winking at you.  \"<i>I don't know of anything that will give humanity though, so I can't really help you if you want to change back...</i>\"  You tell her that's fine and that you'll look on your own if you need to do so.  \"<i>Well then, where is your human home?</i>\" she asks.");
			outputText("<br><br>You tell her that you aren't from this world, and how you actually passed through a portal to get here, and tell her about your home and your family.  However, you avoid any mention of your mission, or about your village's tradition.  Marble pays close attention to everything you say, and seems to really enjoy the story.  At the end, she stops to think about what you told her.  \"<i>That sounds like a really nice place; I wonder if I'll be able to visit some time?  Well sweetie, you've told me about your family; want to hear about mine?</i>\"  Politely, you say you'd be happy to hear about them.");
			outputText("<br><br>She smiles and tells you that she was the oldest child of a cow-girl named Hana, and a dog-morph named Roland.  She loved her mother and very much appreciated the many lessons that Hana taught her, but she was always closer to Roland.  He was always kind to her and never demanded anything from her, always helping her in what she wanted to do and accepting anything she did without complaints.  It was he that taught her how to survive and how to fight.  She goes on to say that she had two other younger siblings, both cow-girls, before she left home.");
			outputText("<br><br>The rest of the meal passes without anything of interest being discussed.  Having now finished your meal together, the two of you stand up and Marble shows you out of her room.  As you're leaving, Marble tells you with a smile on her face that she enjoyed your talk together, and hopes that you'll join her for another soon.");
			//--- end conversation ---
			break;
		//--- Second Conversation ---
		case 1:
			outputText("After you've been talking about inconsequential things for a few minutes, Marble asks you, \"<i>Sweetie, do you ever miss your home?  Do you ever wish you could be back with your parents?</i>\"");
			//[PC is pure] 
			if(player.cor < 33) outputText("<br><br>You sigh and wonder how to word your response for a few moments before telling her that you think about them almost everyday; that it's thoughts of home and family that keep you going.");
			else if(player.cor < 66) outputText("<br><br>You pause a moment before telling her that you used to think about them all the time, but you've since tried to push them from your mind so that you can focus on why you came to this world.");
			else outputText("You chuckle and say that you hardly think of them with all the other fun things to think about.  Then you pause and say that it is in the moments that you do think about them that keep you from forgetting who you once were.");
			outputText("<br><br>\"<i>Hmm, it's nice to hear you care so much about your family.  As for me, I think of them pretty often, especially my daddy.  Don't get me wrong; I do love momma, but she always seemed so bossy around daddy, always giving him orders... and yet he had infinite patience for everyone.  Even after trying hundreds of times to swing straight when I was a little girl he would never lose his patience.</i>\"  She hesitates.  \"<i>No, wait... there was that one time he and momma got into a fight, and afterwards he was really nervous and shaky and he got mad at me.  I cried so much when he scolded me, but the next day he was back to normal - if anything, he was even a bit nicer.</i>\"  She gets misty eyed for a moment.  \"<i>I remember the day where he showed me how to make my first hammer.  I'll never forget what he said then. 'This is a weapon; that means it's for hurting people.  Never raise your hammer against someone unless he is an enemy, and when you do raise it, never hold back and don't give him the chance to hurt you instead.  You need to remember this if you want to survive.</i>\"");
			outputText("<br><br>Marble starts, realizing that she'd been staring wistfully off into space, then she makes a double take and looks out the window.  \"<i>I'm sorry sweetie, but I forgot Whitney had a job for me that I need to go help her with.  Why don't we finish this some other time?</i>\"  She seems in a hurry to go, so you bid the friendly cow-girl good day and return to your camp.");
			break;
		//--- Third Conversation ---
		case 2:
			//siblings
			outputText("You ask Marble if there was any trouble with that last job.  She looks at you a bit embarrassed and admits that it wasn't the first time she'd been late to a job, and it wasn't that big of an issue.  Still, she doesn't like to keep Whitney waiting.  \"<i>Anyway, where were we?</i>\" the cow-girl asks.  \"<i>Ah, yes.</i>\"  Marble nods, and resumes talking about the other members of her family.  \"<i>I'm the oldest of three siblings, sweetie.  Or at least, the three kids that were there when I left home!  I'm also the only one who had daddy's fur; my other two sisters were both black-and-white.</i>\"  She pauses for a moment. \"<i>Ophelia was the next after me; she was a pretty quiet girl most of the time, but when she started talking about all the stories she read, she could talk more than any of us could handle!</i>\"  She smiles at this.  \"<i>I didn't really understand why she liked reading so much at the time, but now I can't find a better way to spend my time when I'm in my stall and hooked up to the milkers.  It's really a nice set-up Whitney put in for me: a comfortable chair, a light, and an end table with an adjustable vacuum level dial.</i>\"");
			outputText("<br><br>She frowns.  \"<i>But the youngest of us... well, let's say that she got along really well with mommy.</i>\"  You ask her what she means; Marble makes a face before answering.  \"<i>Well, mommy was used to getting what she wanted and ordering others to comply; Clara was just like her.  Always bossing everyone else around and always expecting to get her way.</i>\"  She pauses again and her expression softens.  \"<i>Even so, she could always make us laugh, no matter what the mood was.  I think I miss her just the same as the others.</i>\"  She sighs at this, then chuckles.  \"<i>I don't think the me that left home all those years ago would be able to believe I miss Clara now, but I do.</i>\"");
			outputText("<br><br>You idly chat for a few more minutes before parting for the day.");
			break;
		//--- Fourth Conversation ---
		case 3:
			//why she left
			outputText("Marble looks over you a moment before saying, \"<i>You've mentioned this 'mission' a few times now; I guess that's why you left home?</i>\"  You nod.  \"<i>Fulfilling a duty, huh?  My story isn't quite the same as yours, and certainly not so noble!</i>\"  She laughs at this.");
			//[if PC is under 5 feet tall]
			if(player.tallness < 60) outputText("  \"<i>Sorry, sorry, it's just that you're so cute!  I can't picture you as some great hero leaving behind home and family for a mission.</i>\"  She wipes a few tears from her face.");
			//[if PC is over 7 feet tall]
			else if(player.tallness > 84) outputText("  \"<i>I'm sure a giant like you was the perfect choice for this mission.</i>\"");
			outputText("<br><br>\"<i>Like I said, I didn't leave for such a noble reason.  I left because I felt that it was time for me to move on, and to find a mate of my own.</i>\"  She stops for a moment, looking straight at you seriously.");
			//[if affection is high enough that she'll have sex with the PC or is in camp]
			if(gameFlags[MARBLE_AFFECTION] >= 60) outputText("  \"<i>Even though the start of the trip didn't turn out all that well, I think I found what I was looking for.</i>\"");
			outputText("<br><br>A moment later you hear a knock at the door, and then hear Whitney's voice call in, \"<i>Marble hun?  Could ya'll be a dear and help me put out the cows?</i>\"  Marble looks at you for a moment, as if to ask whether you can continue this later.  You nod and she calls out, \"<i>Sure thing Whitney, give me a moment.</i>\"");
			break;
		//--- Fifth Conversation ---
		case 4:
			//Travels and first two lovers
			outputText("After telling Marble about your explorations of the world thus far, Marble offers to tell you a bit more about her own journey.  \"<i>My family actually lives on the other side of the mountains to the south.</i>\"  She pauses, then chuckles.  \"<i>Or is it to the north?  You know how hard it is to describe direction over long distances, don't you?</i>\" You nod; while you've never had any problem with it back home, you can well imagine how the magic of this realm would eliminate the need for such facility.");
			outputText("<br><br>She goes on about how she was exploring the mountains and easily dispatching those of demonic taint that wanted to have their way with her.  After wandering around for a few weeks, something a bit more interesting happened.  \"<i>That was when I met the first man I tried to strike up a relationship with.  He was a big strong minotaur that smelled absolutely incredible... but he was a dick.</i>\"  She shakes her head.  \"<i>He tasted my milk once, and I tasted his cum in turn.  Then the next day, he wanted to force that massive cock of his into my womanhood, even though it obviously wasn't going to fit a young girl like me.  I told him no, and he didn't like that, and down came my hammer.  I felt bad about it at first...</i>\"  She shakes her head again.  \"<i>But then when he woke up he decided he wanted to try and force me again!  After that I had his meat on a plate and I was done with him.</i>\"  Her smile at this declaration is more than a little intimidating.  She tells you the only thing that she really remembers vividly from her time with the minotaur was just how wonderful her first nursing was."); 
			outputText("<br><br>\"<i>I left the mountains behind not long after that.  At the time, I thought that I needed to find someone smaller that wasn't going to give me much trouble.  A few years later I chanced upon a nice-looking husky-dog boy named Ansgar.  We actually got along really well, and he loved nursing me so much.  Though, about a week into it, he just walked up to me and said that he couldn't nurse from me anymore.  I was furious at him, and I just blew up in his face over his refusal.  At the end of it all, his hands started shaking and he ran off.</i>\"  She stops at this and says sadly, \"<i>I never saw him again.</i>\"");
			//[if PC is in the addiction quest or Marble is in camp] 
			if(gameFlags[MARBLE_ADDICTION_LEVEL] == 2 || player.findPerk(PerkLib.MarbleResistant) >= 0) outputText("<br><br>\"<i>I guess it's pretty obvious now why he said he had to stop; he realized he was addicted. I just wish he'd told me at the time so that I knew...</i>\" She sighs.");
			//[If PC said they want the addiction and (the quest is still on or the PC is addicted)]
			else if(gameFlags[MARBLE_ADDICTION_LEVEL] == 1 || player.findPerk(PerkLib.MarblesMilk) >= 0) outputText("<br><br>\"<i>I guess it's pretty obvious now why he said he had to stop; he realized he was addicted.  It's too bad he didn't know how wonderful it is, isn't it?</i>\" She winks at you.");

			outputText("<br><br>Her expression changes and she concludes, \"<i>But that's enough talking about the past and old regrets for now.</i>\"");
			outputText("<br><br>Marble tries to change the subject by bringing up the weather, but this proves to be an exceedingly dull subject when sunny weather seems to be all you have.  It does quickly turn into Marble talking about the somewhat more interesting irrigation set-up that Whitney uses to keep her plants watered.  Eventually the two of you part ways, as you haven't got anything else really interesting that you want to talk about right now.");
			break;
		//--- Sixth Conversation ---
		case 5:
			//Next love, Marble's problem
			outputText("This time it's you who spends a fair bit talking about your own love life back home - or lack thereof, as it seemed to you sometimes.  After you finish, you notice that Marble is looking off to the side.  She turns back to you and thanks you for sharing.  You ask her if she doesn't mind continuing where you left off last time.  \"<i>");
			if(player.findPerk(PerkLib.HistorySlut) >= 0 || player.findPerk(PerkLib.HistoryWhore) >= 0) outputText("Well, you certainly gave an arousing description.  I think I can share something in return.");
			else if(player.cor < 33) outputText("Sweetie, after you told me such a nice story, of course I will.");
			else if(player.cor < 66) outputText("Sweetie, I can tell that you care a great deal about what happened, even if you try to hide it. Of course I'll share.");
			else outputText("Well, you certainly gave an arousing description.  I think I can share something in return.");
			outputText("  After my falling out with Ansgar, I noticed that I really missed nursing him more than anything else.</i>\"  She stops for a moment, shaking her head.  \"<i>That's not quite right.  It's more that I needed to keep nursing; it just felt like everything was wrong with me if I wasn't nursing something.</i>\"");
			outputText("<br><br>\"<i>It was so bad that I had to start nursing anything I could find, even if I had to force it.  The most notable of these was probably this one adorable imp, barely half my height.  I thought that my milk could make something so cute into anything I wanted.  I caught him and made him nurse me all night.  He was just the most wonderful thing once he'd gotten his mind off his monster cock.</i>\" She shakes her head.  \"<i>But an imp has demon taint, so you know how this is going to end, don't you?  The next day, my 'special' friend had gone out to get his other friends and decided that I'd make a wonderful sex toy.</i>\"  She smiles.  \"<i>That was one hell of a day... though maybe not in the way they expected.  I gave them such a bad beating that I doubt that they'll ever try to gang-rape someone outside the cover of night again.  Speaking of which sweetie, you'd best not show any of those horrible creatures where you live, ok?</i>\"");
			//[if PC has been gang-banged by imps]
			if(player.findStatusEffect(StatusEffects.ImpGangBang) >= 0) outputText("<br><br>You give a small chuckle at the belated advice; it would have been useful earlier.");
			else outputText("<br><br>You nod and thank Marble for the advice; but as long as you have to stay by and defend this side of the portal from being occupied, you're pretty sure it's a moot point.");
			outputText("<br><br>The two of you decide to end things at that for now; Marble seems a bit restless after discussing nursing so much and often caresses her sensitive breasts when she thinks you aren't looking.  She's probably eager to get back in the milker.");
			break;
		//--- Seventh Conversation ---
		default:
			//Meeting Whitney, and life on the farm
			outputText("\"<i>So sweetie, how did you come to Whitney's farm?</i>\"  You tell her that you simply stumbled upon it a few times, before becoming familiar enough with it to come back whenever you wanted.  She nods and says, \"<i>Yeah, it was the same for me.  Happened about a year ago actually.  Was Whitney ever shocked that day to see an eleven year-old cow-girl waltz into her farm, pick her up, and force her to nurse!  She didn't like that one bit!  Eventually she got me over to the barn and convinced me to try using the milkers.</i>\"  Marble smiles.  \"<i>Since that day, I've been able to keep my needs in check.  It isn't as satisfying as actually nursing someone, but it does take the edge off considerably.  After I'd been around for about a month, Whitney let me move into the barn.  I've been here since, helping her with the chores around the farm and helping protect it from attacks.  Whitney has been especially appreciative of my help with the heavy lifting, since I was pretty much the strongest person she'd ever met.");
			//[if PC strength is < 90]
			if(player.str < 90) outputText("  In fact, I don't think there's anyone out there who is stronger than me.");
			else outputText("  You're probably the only other person I've ever met who is stronger than me.");
			outputText("</i>\"");
			outputText("<br><br>Marble looks up to grin at you, and finally notices the dumbstruck look on your face.  \"<i>Uh, sweetie, what is it?</i>\"  You make absolutely sure that you heard her right when she said she was 11 years old last year.  She nods, and asks you why you find that so odd.  You can only shake your head and inform her that humans take about 18 to 25 years to fully mature.  She laughs at this idea and says that she's been fully grown since she was 6; all the members of her race are that way - those she's met, anyway.  Well, there isn't much else you can say to that.");
			//-page break-
			outputText("<br><br>\"<i>Well, that's basically the story of my life.  I guess I've heard everything about you now");
			if(player.findStatusEffect(StatusEffects.CampMarble) < 0) outputText(", except that mission of yours that's so important to you");
			outputText(".</i>\"");
			outputText("<br><br>You decide to ask her if she's changed since she left home.  \"<i>Well, I guess I'm a lot more level-headed than I was before, and I'm able to control myself much better when someone refuses to drink my milk.  It still makes me really mad inside, but I keep a lid on it.</i>\"  She stops for a moment.  \"<i>I'm also fairly good at hiding my feelings.");
			//[if Marble is not in camp] 
			if(player.findStatusEffect(StatusEffects.CampMarble) < 0) {
				outputText("  I may not show it, but I'm actually really lonely on the inside.");
				//[if addiction quest is active, and Marble is ashamed of her milk]
				if(gameFlags[MARBLE_ADDICTION_LEVEL] == 2) outputText("  I really just wanted someone who loved me and loved nursing from my breast.  I had no idea what that would do to you.");
				//[if addiction quest is active, and Marble is happy with her milk]
				else if(gameFlags[MARBLE_ADDICTION_LEVEL] == 1) outputText("  But I think that I've found the one who will change that.  Right sweetie?");
				//[if addiction quest has not yet triggered]
				else outputText("  Though, I'm not giving up hope yet.");
				outputText("</i>\"");
			}
			else outputText("  Until I met you, I was actually really lonely on the inside.</i>\"");
			outputText("<br><br>You thank Marble for sharing so much about herself with you.  She nods and says, \"<i>It was my pleasure, sweetie.  You're the first person who's ever shown so much interest in me, and I really enjoyed telling you.  Come back and visit anytime, I'm glad to have someone to talk to like this.</i>\"");
			break;
	}
	gameFlags[MARBLE_FARM_TALK_LEVELS]++;
}

MarbleScene.marbleAddiction = function(newPage) {
	displaySprite("marble");
	if(newPage) clearOutput();
	
	outputText("You lean against her chest and breathe in her smell.  You feel oddly at peace with yourself and fall asleep, still buried in her bust.  You wake up a while later and notice the two of you are now lying down on her bed, Marble absentmindedly stroking your head.  She notices you stirring and giggles, \"<i>Good morning, sleepyhead. That's the first time I've ever had someone fall asleep while drinking my special milk.  Did you enjoy it?</i>\"  At the mention of her milk, you suddenly feel like you want more of it. In fact, you really want more.  You start to shake as you turn around, overwhelmed by you need for more, and beg Marble to let you drink more of her milk.  She is surprised at your need, but agrees to let you drink.  As her milk rushes into your mouth, you feel your body calm down as the feeling of euphoria once again passes over your body.  An alarming thought enters your head and your eyes go wide. You hear Marble gasp above you as she comes to the same realization that you just did.\n\n");
	outputText("<b>Marble's milk is addictive, and you are now addicted to it.</b>\n\n");
	outputText("You pull back from her and look up into her eyes.  \"<i>Sweetie, how are you feeling?  Do you like drinking my milk?  Do you want to always drink my milk?</i>\" she says to you with uncertainty.  How do you reply?\n\n");
	
	doYesNo(MarbleScene.wantMarbleAddiction, MarbleScene.doNotWantMarbleAddiction);
}

MarbleScene.wantMarbleAddiction = function() {
	DisplaySprite("marble");
	clearOutput();
	
	outputText("You smile and tell her that her milk is the most wonderful thing you've ever had. You'll always want to drink it and do not care if it's addictive.  She gives a small smile before softly saying, \"<i>Are you sure, sweetie?</i>\"  You nod eagerly and try to continue drinking... but you can't bring yourself to do it.  You really want to drink from her, but your body doesn't seem to let you.  \"<i>What's wrong, sweetie?</i>\" she asks, confused at your hesitation, \"<i>I thought you wanted to drink my milk?</i>\"  You explain to her that you're trying, but you just can't bring yourself to.  \"<i>I'm not stopping you sweetie, go ahead.</i>\"  As if a floodgate had been opened, you rush forward and start guzzling down her breast milk once again.  After you've finished, you pull back and look up at Marble. She takes a moment to think before saying slowly, \"<i>So you can't drink without my permission?</i>\"  She smiles down at you, though you can't help but feel a little uncomfortable at this apparent power she has over you.  You decide to excuse yourself and get up.  As you go to the door, Marble calls out to you, \"<i>Sweetie, just come back whenever you get thirsty ok?  I'm looking forward to seeing how you are.</i>\"  She giggles softly as you go out the door, leaving you to wonder if you just made a big mistake.");
	
	//(increase affection by 5)
	//(set knowAddiction to 1)
	gameFlags[MARBLE_AFFECTION] += 5;
	gameFlags[MARBLE_ADDICTION_LEVEL] = 1;

	//(increase corr by 5)
	player.modStats("cor", 5);	
	// Apply Marble's Milk effect to the player
	MarbleScene.applyMarblesMilk();
	
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.doNotWantMarbleAddiction = function() {
	DisplaySprite("marble");
	clearOutput();
	
	outputText("You tell her that you've realized that her milk is addictive and you can't afford to depend on it.  Tears well up in her eyes and she breaks down. \"<i>I'm so sorry, I didn't know!</i>\" she says between sobs, \"<i>I guess I'm just another wretched creature of this world.  I thought I was special, but it looks like I'm corrupt too...</i>\"  She suddenly reaches out and hugs your head tightly to her chest as she rocks back and forth.  After a few minutes she holds you out and looks into your eyes. \"<i>Please forgive me!</i>\" she says before jumping off her bed and running out the door.  You spend some time looking around the farm for Marble, but you're unable to find her.  You tell Whitney what happened, and she promises that as soon as she knows where Marble went, you'll be the first to know.");
	
	//(increase affection by 5)
	//(set knowAddiction to 2)
	gameFlags[MARBLE_AFFECTION] += 5;
	gameFlags[MARBLE_ADDICTION_LEVEL] = 2;
	
	//(increase corr by 5)
	player.modStats("cor", 5);	
	// Apply Marble's Milk effect to the player
	MarbleScene.applyMarblesMilk();
	
	doNext(Camp.returnToCampUseOneHour);
}

// Work/Help Scenes

MarbleScene.marbleWarningStateMeeting = function() {
	displaySprite("marble");
	clearOutput();
	outputText("While walking through one of the farm's fields, you notice the cow-girl Marble coming out of the barn ahead of you.  When she sees you, she pulls a bit of an irritated face before donning a fake smile and saying, \"<i>Yes?  Can I help you?  Or were you just leaving again?</i>\"  Well... that wasn't terribly nice.  The two of you didn't exactly get off to a good start before, but maybe you'd like to correct that?  On the other hand, she'll probably ask you to suckle her breasts if you do apologize; maybe it would be best to just avoid her for now - or perhaps entirely?  Then again also, you could pick a fight over her behavior towards you.");
	//PC chooses: apologize, pick a fight, leave, leave forevs
	menu();
	addButton(0, "Apologize", MarbleScene.apologizeToMarble);
	addButton(1, "Pick Fight", MarbleScene.pickAFight);
	addButton(2, "Leave4Ever", MarbleScene.leaveNonFriendsMarble4Ever);
	addButton(14, "Leave", MarbleScene.leaveNonFriendsMarble);
}

MarbleScene.apologizeToMarble = function() {
	displaySprite("marble");
	clearOutput();
	outputText("Wanting to make up for before, you apologize for your behavior and ask Marble if there is a way you could make it up to her.  She's pleasantly surprised by your answer, and after a few moments of contemplation says, \"<i>Well, all right then.  My breasts are still a bit sore - after all, I have to milk them every day - so do you think you could give them that personal touch?</i>\"  You figured she would ask this of you... quite the one-track mind.");
	outputText("\n\nMarble looks around before ducking inside the field of tall stalks of grain next to her.  After a moment, you follow her into the crops that are waving in the breeze.  Her trail through the many plants isn't that hard to follow, but from the sounds of the giggles up ahead, this has turned into a game.");
	
	//Basic scene 
	outputText("You give chase after the bovine woman, wandering around the many plants in search of the runaway.  Her constant giggling makes sure you know you're going in the right direction, but sometimes she likes to double back or make false trails so the game is more interesting.  ");
	
	//(intelligence check; <15, 15-40, 41+) 
	if(player.inte < 15) outputText("Eventually you find Marble stopped, looking towards you with her hands in the air saying, \"<i>You caught me!  Come here.</i>\"  She beckons you towards her chest, and you don't make her wait.");
	else if(player.inte < 40) outputText("Eventually you find Marble stopped and waiting for you.  She puts her hands in the air and says, \"<i>You caught me!</i>\"  It's fairly clear she's given herself up, but when she folds her hands in front of her chest and presses her breasts together, then tells you to come over, you aren't complaining.");
	else outputText("It isn't too hard to figure out that Marble isn't really trying, and you easily catch her off guard on one of her double backs.  She doesn't even notice you until you peek out from between the stalks next to her, reaching out and getting a handful of her backside.  \"<i>Clever " + player.mf("boy","girl") + "...</i>\" she says.");
	
	outputText("\n\nMarble pulls you to the ground, and you fall onto the lovely lady's lap.  Before you can say anything, Marble shushes you with a finger to your lips.  She pulls up her top, stopping for a moment and winking at you when she reveals underboob, then lets her nipples slip out.");
	outputText("\n\n\"<i>Care to have some of my bountiful breasts, you sweet thing?</i>\" she says, smiling eagerly and presenting you with one of her half-inch long reddish nipples.  You notice that each nipple has a sore-looking swollen ring around it, probably the source of Marble's discomfort.");
	outputText("\n\nYou knew she was going to get around to this, so you figure you might as well get it over with.  It's not like they're not really nice breasts, after all...  You lower your [face] to her nipple, and gently wrap your lips around it.  Marble sighs contentedly as you do so, and starts to groan slightly in pleasure as the first of the milk leaks from her teats.  You certainly can't argue with the taste, sweet and creamy, and start to down the delicious fluid with relish.  Marble doesn't seem to mind at all; in fact, the sounds of her pleasure only increase.");
	outputText("\n\nAfter several minutes, Marble puts her hand on your forehead, and gently asks you to take care of her other breast.  You don't disappoint her, and deeply draw milk from the other nipple with just as much vigor as before.");
	outputText("\n\nAfter another few minutes, you finally have drawn your fill, and pull back from Marble, as she looks down at you with a kindly and pleased face.  \"<i>Thank you so much for that, sweetie.  I can't possibly refuse your apology after that.  You're welcome to come and visit me here on the farm any time.</i>\"  The cow-girl gives you a peck on the check and redresses her bountiful bosoms - a small part of you is sad to see them go.  She helps you to stand up and walks you back to the main barn, then returns to her chores.");
	
	//increase addiction score by 10
	//set affection to 5
	gameFlags[MARBLE_AFFECTION] += 5;
	gameFlags[MARBLE_ADDICTION] += 10;
	gameFlags[MARBLE_WARNING] = 0;

	//(apply the stat effect 'Marble's Milk' to the player)
	MarbleScene.applyMarblesMilk();
	
	// Change stats
	player.modStats("lib", .2, "lus", (5 + player.lib/10));
	player.changeHP(100);
	player.changeFatigue(-50);

	doNext(camp.returnToCampUseOneHour);
}

MarbleScene.pickAFight = function() {
	displaySprite("marble");
	clearOutput();
	outputText("You make known your displeasure at her attitude toward you.  \"<i>So now I'm the one who has a problem, huh?  That's very funny, I distinctly remember you being the jerk.  You get my hopes up, then just leave?</i>\"  Oh, you've nearly had it with this self-adoring boob fetishist, and say as much.  \"<i>WHAT DID YOU CALL ME?!</i>\" she screams in shock and anger.  You say it again, right to her face, and then she turns around, incensed, and stomps off quickly toward the barn.  \"<i>Wait right there, my hammer's got something to say to that.</i>\"");
	//[Stay][Fuck That]
	menu();
	addButton(0, "Stay", MarbleScene.stayForFights);
	addButton(1, "Fuck That", MarbleScene.getOutOfDodge);
}

MarbleScene.stayForFights = function() {
	displaySprite("marble");
	clearOutput();
	outputText("You fold your arms over your chest and scowl as Marble trudges back over the fields carrying a huge hammer.  Part of you feels terribly juvenile to be solving an argument with violence - but the other part is cheering at the opportunity to put the bossy cow in her place.");
	startCombat(new Marble(), true);
}

MarbleScene.getOutOfDodge = function() {
	displaySprite("marble");
	clearOutput();
	outputText("The hell you will... the truth is the truth no matter how many talking hammers show up.  Catharsis completed, you leave the farm and its cows behind.");
	
	//makes the battle available as the next Marble encounter, as if PC had raped her
	gameFlags[MARBLE_WARNING] = 3;
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.leaveNonFriendsMarble = function() {
	displaySprite("marble");
	clearOutput();
	outputText("Smiling politely and just as insincerely as Marble, you beg her pardon and excuse yourself.");
	//end event, initial non-friends event can repeat in future explorations
	doNext(camp.ReturnToCampUseOneHour);
}

MarbleScene.leaveNonFriendsMarble4Ever = function() {
	displaySprite("marble");
	clearOutput();
	gameFlags[NO_MORE_MARBLE] = 1;
	gameFlags[MARBLE_WARNING] = 2;
	outputText("Answering the cow-girl with a blank look, you shake your head and walk away, resolving to avoid Marble from now on.");
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.helpMarble1 = function() {
	displaySprite("marble");
	clearOutput();
	
	outputText("\"<i>You know, Marble is moving some produce right now. How about you go help her out?</i>\" Whitney suggests.  You agree to help the well-endowed anthropomorph and Whitney directs you to the storage shed.  You arrive to find that Marble is quite busy carrying stacks of crates into the barn.  She gives you a smile when she sees you and calls out, \"<i>Hey, sweetie!  Nice to see you.</i>\"  When you tell her you came to help her smile broadens.  \"<i>Oh, I'd love to have some help.  It'll save me some trips if you give me a hand,</i>\" she says happily before putting on a serious face and continuing, \"<i>but don't strain yourself sweetie, these are heavy. I don't want you to get hurt.</i>\"  With that, you get to work with her.\n\n");
	
	//Strength Check
	if(player.str < 20) outputText("Unfortunately, the crates are quite heavy and you end up having to stick with small ones to keep up with Marble's pace.  She doesn't appear to mind, just enjoying having someone to talk to while she works, even if it doesn't save her many trips.\n\n");
	else if(player.str < 50) outputText("You try your best, but for every crate you carry, Marble caries three. She doesn't mind though, since you'll end up saving her a quarter of the trips she would have had to make.\n\n");
	else if(player.str < 80) outputText("You put your back into the job and manage to match Marble in her efforts.  She is really impressed with your strength, and together you can cut the number of trips needed in half.\n\n");
	else outputText("Marble may be strong, but you are stronger.  She is amazed as you manage to take even more crates at a time than she can, only held back by the number you can balance.  Thanks to your efforts, the chore only takes a third of the number of trips it normally would have taken.\n\n");
	
	outputText("After a little while, you notice that Marble is walking with an almost mesmerizing sway in her hips as she carries the crates; it is rather hard to take your eyes off her.  ");
	
	if(MarbleScene.afterMarbleHelp()) return;
	
	outputText("When the two of you finish and you start to leave, Marble calls out to you, \"<i>Wait, let me give you something!</i>\" You turn and look back at her as she rushes up to you.  Smiling brilliantly, the cow-girl hands you a bottle full of warm milk, \"<i>My gift to you for your help, fresh from the source.</i>\" she says, patting her sizable chest.\n\n");
	
	//Increase stats
	player.modStats("str", 1, "lus", 10);
	//(increase affection by one tenth the player's str)
	gameFlags[MARBLE_AFFECTION] += int(player.str/10);
	
	//(player receives a bottle of Marble's milk)
	//inventory.takeItem(consumables.M__MILK, camp.returnToCampUseOneHour); //TODO: Make item
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.helpMarble2 = function() {
	displaySprite("marble");
	clearOutput();
	
	outputText("You run into Whitney at the farm, and ask if there's something you could do.\n\n");
	outputText("\"<i>I've got it; you can help Marble do some weeding.  She's in the field over there right now,</i>\" Whitney says, pointing to a nearby pasture.  Nodding to her, you set off to help the pretty cow-girl with her chores.  It takes you a while to find her, but you eventually find Marble bent over with her rump in the air.  Once you get closer you realize that she is munching on a weed.  \"<i>Oh!</i>\" she exclaims, noticing you.  She hurriedly straightens up and looks around a little embarrassed.  \"<i>Hi there sweetie, what are you doing here?</i>\"  You explain that Whitney suggested you could help her with the weeding.  \"<i>Oh!</i>\" she exclaims again, \"<i>I guess that would be nice, but don't stare at my bum too much while I'm eating, ok?</i>\"  You agree and set to work.\n\n");
	
	//Speed check
	if(player.spe < 20) outputText("Even though Marble often stops to munch on a weed, she is still able to get more weeds then you do.  Despite her size, she can move surprisingly fast.  Regardless, she enjoys simply having you there while she works, and you get to enjoy the view.\n\n");
	else if(player.spe < 50) outputText("You put in a good effort at cleaning out the weeds, and Marble often gives you a good look at her rear when she finds a tasty looking weed.\n\n");
	else if(player.spe < 80) outputText("Moving quickly through the fields, you surprise Marble with your speed so much that she jokingly pouts that you're getting to all the tasty weeds before she has a chance to eat them.  You still end up getting a few good views of her ass.\n\n");
	else outputText("Weeding the field is a breeze for you, going fast enough that you're able to bring weeds to Marble faster than she can eat them.  In the end, you do almost all the work yourself.  She does reward you with a good view for your efforts.\n\n");
	
	//Increase stats
	player.modStats("spe", 1.5, "lus", 10);
	//(increase affection by one tenth the player's spd)
	gameFlags[MARBLE_AFFECTION] += int(player.spe/10);

	if(MarbleScene.afterMarbleHelp()) return;
	
	outputText("When the two of you finish and you start to leave, Marble calls out to you, \"<i>Wait, let me give you something!</i>\" You turn and look back at her as she rushes up to you.  Smiling brilliantly, the cow-girl hands you a bottle full of warm milk, \"<i>My gift to you for your help, fresh from the source,</i>\" she says, patting her sizable chest.\n\n", false);
	
	//(player receives a bottle of Marble's milk)
	//inventory.takeItem(consumables.M__MILK, camp.returnToCampUseOneHour); //TODO: Make item
	doNext(Camp.returnToCampUseOneHour);
}

MarbleScene.afterMarbleHelp = function() {
	displaySprite("marble");
	//This occurs after the start text, but before Marble gives the player a bottle of her milk.  I wanted to make sure there is a chance the player can get addicted whenever they go to the farm.
	//(if the player has 40+ addiction after helping Marble work, roll an int check)
	if(gameFlags[MARBLE_ADDICTION] >= 40) {
		//[the player fails the int check]
		if(player.inte < 40 && rand(2) == 0) {
			outputText("You find that the more time you spend being around Marble, the thirstier you grow for her milk.  Finally, as the two of you are finishing, you are unable to take it any longer and beg Marble to let you drink her milk.  After a moment, your words sink in and she blushes deeply.  \"<i>Ok sweetie, since you helped me out and all, let's go back to my room.</i>\"  You enter into her pleasant room once again.  She invites you onto her lap and lets you start sucking at one of her nipples.  The moment that wonderful taste meets your tongue, you start gulping down the milk without abandon. She sighs in pleasure in response.  From time to time, Marble gets you to switch nipples, all the while gently stroking your head and occasionally scratching behind your ears.\n\n");
			outputText("Once you've had your fill, you pull back and the two of you smile at each other.  \"<i>It's really nice for you isn't it sweetie?  Nice for me too to have someone like you that can give a good suck on my sensitive nipples.</i>\"\n\n");
			//(increase addiction by 10, skip straight to addiction event without doing anything else)
			gameFlags[MARBLE_ADDICTION] += 10;
			//Call addiction event here?
			MarbleScene.marbleAddiction(false);
			return true;
		}
		//[player succeeds the int check] 
		else {
			outputText("While you're working, you are continually plagued by the thought of drinking from Marble's breasts, but you're able to keep those thoughts at bay and continue working normally.\n\n");
		}
	}
	return false;
}

MarbleScene.postAddictionFarmHelpings = function() {
	DisplaySprite("marble");
	clearOutput();
	
	outputText("Smiling, Whitney suggests that you go help Marble out with her chores.  You readily agree and go out to meet with her.  Afterwards, Marble offers you a bottle of her milk.  ");
	
	//[if player is no longer addicted]
	if(player.findPerk(PerkLib.MarbleResistant) >= 0) outputText("She assures you that you can't get addicted to it again if you don't drink her milk directly from her breasts.");
	
	//(randomly raise either str or spd)
	player.modStats("str", rand(2),"spe", rand(2)); // TODO FIX TO INTENDED
	
	//(player gets a bottle of Marble's milk)
	//inventory.takeItem(consumables.M__MILK, camp.returnToCampUseOneHour); TODO
	doNext(Camp.returnToCampUseOneHour);
}

// Sex scenes

MarbleScene.standardSex = function(newPage) {
	displaySprite("marble");
	if (newPage) clearOutput();
	
	// If player is genderless
	if (player.gender == 0) {
		marbleGenderlessNoFuck();
		doNext(Camp.returnToCampUseOneHour);
		return;
	}
	else if (player.gender > 0) {
		outputText("Marble smiles at you and leads you towards her bed.  She gets you to sit on one end while she moves to the head. As she sits down, she slowly starts to remove her clothes:  First she pulls off her top and gives you a full view of her breasts, rubbing and caressing them before running one hand down to her skirt and slipping it off.  She pulls her tail up between her breasts and gives you a coy smile as she slips the ribbon on it off. She is now completely naked.  \"<i>Now it's your turn,</i>\" she tells you with a smile.<br><br>");
		//(player is wearing fetish gear)		
		if(player.armor.longName == "bondage patient clothes" ||
		   player.armor.longName == "crotch-revealing clothes" || player.armor.longName == "cute servant's clothes" ||
		   player.armor.longName == "maid's clothes" || player.armor.longName == "servant's clothes") {
			outputText("You smirk at her and demonstrate just how easy it is to get at your genitals while wearing this outfit.  But you decide to not disappoint her, making a show of removing your " + player.armor.longName + " and pretending to have some modestly when you show off your ");
			//[player has at least one dick]
			if(player.totalCocks() > 0) {
				outputText(player.multiCockDescriptLight());
				//player also has a vagina]
				if(player.vaginas.length > 0) outputText(" and your ");
			}
			//[player has a vagina]
			if(player.vaginas.length > 0) outputText(player.vaginaDescript(0));
			outputText(".  You also make sure that there is no lingering clothing on your body for her, just as she did for you.<br><br>");
		}
		//(player is not wearing fetish gear)
		else {
			outputText("You smile in return and begin removing your " + player.armor.longName + " from your body.  You start by slowly slipping off your top to reveal your " + player.allBreastsDescript() + ", ");
			//[player's breasts are at least B cup]
			if(player.biggestTitSize() >= 2) outputText("running one of your hands down them before continuing.");
			//[player has small or no breasts]
			else outputText("running one of your hands over them before continuing on.");
			outputText("  You slip open the lower half of your clothes, revealing your ");
			// Player has at least one dick
			if(player.totalCocks() > 0) {
				outputText(player.multiCockDescriptLight());
				//player also has a vagina]
				if(player.vaginas.length > 0) outputText(" and your ");
			}
			//[player has a vagina]
			if(player.vaginas.length > 0) outputText(player.vaginaDescript(0));
			outputText(".  You then remove any other clothing, leaving your body bare.<br><br>");
		}
		//(player is a herm)
		if(player.gender == 3) {
			outputText("Marble's eyes widen as you show off your equipment.  \"<i>You have both?</i>\" she says in awe. \"<i>I'm not sure if I can pleasure both parts of you at the same time... which would you prefer to use?</i>\"<br><br>Which of your genitals do you want to have sex with?");
			//– player chooses: dick(s)/vagina, base on choice, treat the rest of the encounter as if they were male or female
			menu();
			addButton(0, "Maleness", MarbleScene.sexContinued, -1);
			addButton(1, "Female", MarbleScene.sexContinued, -2);
			return;
		}
		//male
		else if (player.gender == 1) MarbleScene.sexContinued(1);
		//female
		else if (player.gender == 2) MarbleScene.sexContinued(2);
	}
	doNext(Camp.returnToCampusOneHour);
}

MarbleScene.sexContinued = function(genders) {
	displaySprite("marble");
	if (genders < 0) {
		genders = -genders;
		clearOutput();
	}
	//(player is male)
	if(genders == 1) {
		outputText("Marble leans back and invites you to come.  With a coy grin, you slowly crawl towards her, each movement bringing the two of you closer until you are on top of her body. She puts her hands around you and lies back completely.  You carefully line up your " + player.cockDescript(0) + " and thrust into her warm snatch.  ");
		//[player is less than 8 inches in length]
		if(player.cocks[0].cockLength < 8) outputText("You easily slide all the way into her depths before beginning your hungry thrusts.  ");
		//[player is more than 8 inches in length]
		else outputText("She is unable to take all of you, but you're hardly discouraged as you begin your hungry thrusts.  ");
		outputText("She gasps slightly and her arms clamp down on you, ");
		//[player is between 4 and 5 feet in height]
		if(player.tallness < 60 && player.tallness >= 48) outputText("keeping your head tightly locked between her breasts.  ");
		//[player is not between 4 and 5 feet in height] 
		else outputText("keeping your body tightly locked against her.  ");
		outputText("Her tight grip does nothing to slow your thrusts, only helping to bring the both of you closer and closer to sweet release.  Finally, you push into her as far as you can", false);
		//[player has a knot and is not more than 8 inches long]
		if(player.cocks[0].cockLength < 8 && player.hasKnot(0)) outputText(", and with a pop, your knot slips inside of her");
		outputText(".  Deep within her, your " + player.cockDescript(0) + " explodes.  Within moments, Marble feels her orgasm too, her grip intensifying immensely.  You hear her give a sigh that sounds almost like a moo and her grip relents.  The two of you lay there panting, your " + player.cockDescript(0) + " still inside her.<br><br>");
	}
	//(player is female)
	else {
		outputText("Marble grins at you and reaches into the drawers of the mini-dresser next to her bed, pulling out a long, double-ended dildo. She slips one half into her own hole and invites you over to her.  With a coy grin, you slowly crawl towards her, each movement bringing the two of you closer until you slip your " +  player.vaginaDescript(0) + " onto the other end of the dildo.  Sighing, Marble lies down underneath you and begins to rock back and forth.  You bring your own ministrations to the mix in response. Soon, the two of you are panting and moaning against each other with the dildo sliding around between you.  Suddenly, she locks her arms around you tightly and ");
		//[player is between 4 and 5 feet in height]
		if(player.tallness < 60 && player.tallness >= 48) outputText("squeezes your head into her breasts.  ");
		//[player is not between 4 and 5 feet in height]
		else outputText("pulls you securely against her.  ");
		outputText("Marble shudders with pleasure and redoubles her efforts at moving the dildo, quickly pushing you over the edge as well");
		//[player has at least one dick]
		if(player.totalCocks() > 0) outputText(".  Your " + player.multiCockDescriptLight() + " erupts while clamped between your bodies");
		outputText(".  Her grip soon relents and the two of you lay there panting, the dildo still connecting you.  You can hear Marble say under her breath \"<i>That was way better than on my own...</i>\"<br><br>");
		//(remove vaginal virginity?  "Your hymen is torn...")
		player.cuntChange(8, true);
	}
	//(first time sex)
	if(player.findStatusAffect(StatusAffects.FuckedMarble) < 0) {
		outputText("After a few minutes pass, Marble breaks the silence. \"<i>Sweetie, that was wonderful. You're really special to me, yah know?  Please remember that.</i>\"  You know that your relationship is special too; you won't forget Marble anytime soon.");
		player.createStatusAffect(StatusAffects.FuckedMarble,0,0,0,0);
	}
	//(repeat sex)
	else {
		outputText("Marble sighs and gives you a big smile. \"<i>Sweetie, you're just as wonderful to be with as ever.  I'm always looking forward to our times together,</i>\" she tells you.  You would be inclined to agree with her.");
	}
	player.orgasm();
}

MarbleScene.marbleMilkSex = function(newPage) {
	displaySprite("marble");
	if (newPage) clearOutput();
	
	// Player is genderless
	if(player.gender == 0) {
		marbleGenderlessNoFuck();
		return;
	}
	
	outputText("Drinking her milk has filled you with an intense need, and you can see that need in Marble's eyes too.  You have no choice; you are going to have sex with her.<br><br>");
	//[player is wearing fetish gear]
	if(player.armorName == "bondage patient clothes" ||
		   player.armorName == "crotch-revealing clothes" || player.armorName == "cute servant's clothes" ||
		   player.armorName == "maid's clothes" || player.armorName == "servant's clothes") {
		 outputText("She moves first to get a good view of your equipment.  ");
	}
	//[player is not wearing fetish gear]
	else {
		outputText("She moves first and pulls open your " + player.armorName + " to get a view of your equipment.  ");
	}
	//(player has at least one dick)
	if(player.cockTotal() > 0) {
		//[player has only human or animal dicks]
		if(player.cockTotal() == player.horseCocks() + player.dogCocks() + player.normalCocks()) {
			outputText("Marble seems pleased at the sight of your " + player.multiCockDescriptLight() + " and she pushes you back onto her bed.  She removes her own skirt and stops for a moment at her tail.  Giggling slightly, she uses her ribbon-tied tail to brush at your " + player.multiCockDescriptLight() + " before climbing on top of you and slipping her legs to your sides.<br><br>");
		}
		//[player has at least one of a different kind of dick]
		else {
			outputText("Marble gives a long hard look before pointing at your ");
			temp = player.cocks.length;
			while(temp > 0) {
				temp--;
				if(player.cocks[temp].cockType.Index > 2) {
					outputText(cockDescript(temp));
					temp = -1;
				}
			}
			outputText(".  \"<i>Sweetie, what the heck is that?</i>\" she asks in an unsure tone. You smile at her and tell her that she should touch it.  After a moment, Marble reaches out and seems to visibly relax after feeling its texture and stiffness.  She pushes you back onto her bed before slipping free of her own garments and climbing on top of you.  She gives you a sly smile as she puts her legs on your sides.<br><br>");
		}
		
		//[player has more than one dick]
		if(player.cockTotal() > 1) outputText("\"<i>So, which one is your favorite?</i>\"  Marble asks you while taking measure of your " + player.multiCockDescriptLight() + ".  Before you have a chance to answer, Marble grabs a hold of your central " + player.cockDescript(0) + " and says \"<i>I'll bet it's this one.</i>\"  ");
		outputText("Without much hesitation, Marble lifts herself up, and impales her moist lips upon your " + player.cockDescript(0) + ".  The two of you gasp as you sink into her interior.  You feel each inch slowly flow inside her until ");
		//[dick(0) is less than 8 inches long]
		if(player.cocks[0].cockLength < 8) outputText("every bit of your " + player.cockDescript(0) + " is deep inside.  ");
		//[dick(0) is more than 8 inches long]
		else outputText("Marble bottoms out at eight inches and you can go no further.  ");
		outputText("With a delighted shiver, Marble starts to push herself up and down on you, her movements growing more and more frantic over time.  You try to slow her down but she seems to be beyond the capability of listening to you now, giving only louder and more frantic moans of pleasure.  Sooner than you would have preferred, you explode inside her. At that moment, Marble gives a final moan that sounds almost exactly like a moo.  She slows down, seeming to have already reached her peak.<br><br>");
		outputText("You can see that Marble is quite pleased and satisfied after that milking and sex combo session.  She rolls off you onto her bed and is soon asleep.  It takes you a few moments to get cleaned up, still in a slight daze after that frantic lovemaking.  As you depart, you give a final glance to Marble and see her still dozed off on her bed in a slightly lopsided position.");
	}
	//(player is female)
	else if(player.vaginas.length > 0) {
		//[player has sizable breast, C or bigger]
		if(player.biggestTitSize() > 2) {
			outputText("Marble runs her fingers along your " + player.vaginaDescript(0) + " for a moment before slipping a hand onto your " +  player.biggestBreastSizeDescript() + ".  She smiles at you and says \"<i>I think that maybe we should play up here. You did enjoy mine, so I think I'll enjoy yours.</i>\"  She helps you slips off your garments and lies you down on her bed, quickly taking her place on top of you.  She sticks her tongue out before putting her mouth to one of your " +  player.nippleDescript(0) + "s and giving it a series of gentle licks.  Taking a moment to lick her lips, Marble starts to rub, caress and lick each of your " +  player.allBreastsDescript() + " in turn with her hands and face, always gently and always lovingly.  Marble seems to be quite familiar with these techniques; she has probably practiced on herself many times before.<br><br>");
		}
		//[player has smaller then C breasts]
		else {
			outputText("She teases your " +  player.vaginaDescript(0) + " with her fingers for a moment before putting her hand on one of your " +  player.biggestBreastSizeDescript() + ".  \"<i>I'm not sure what to do with teats this small, but I'll do my best. Though I feel kinda sorry for you, sweetie.</i>\"  You open your mouth to make an indignant response, but Marble puts a figure on your lips to shush you. She gives you an intense stare and tells you in no uncertain terms that since you enjoyed her breasts so much, it's only fair that she gets to experience your " +  player.allBreastsDescript() + ".  She then sticks out her tongue at you before giving your " +  player.nippleDescript(0) + " a lick and rub down, which she extends to the ");
			if(player.totalNipples() > 2) outputText("other");
			else outputText("rest");
			outputText(".<br><br>");
		}

		outputText("After finishing up");
		//[if player has more than two breasts]
		if(player.totalBreasts() > 2) outputText(" with each of your " +  player.allBreastsDescript());
		else outputText(" with each of your " +  player.breastDescript(0));
		outputText(", Marble looks up at you and sticks her tongue out again.  \"<i>Now it's time for the main course!</i>\" she whispers before lowering her head down to one of your " +  player.nippleDescript(0) + "s and closing her mouth around it. She soon begins to suckle your nipple.<br><br>");
		//[if player has nipplecunts]
		if(player.hasFuckableNipples()) {
			outputText("As Marble's tongue rubs against your " +  player.nippleDescript(0) + " it slips inside, much to her surprise.  She pulls back for a moment and gives you a confused look.  You tell her it isn't a problem; it only makes you happier. Understanding, Marble quickly resumes her efforts.  Her talented tongue fucks your " +  player.nippleDescript(0) + " in earnest.");
			//[player is lactating]
			if(player.biggestLactation() > 1) outputText("  The whole while, Marble continues to gulp down your milk.");
		}
		//[if player is lactating]
		else if(player.biggestLactation() > 1) outputText("Her suckling soon brings a stream of milk to her lips that she gulps down eagerly.  You give a contented sigh, but are soon brought out of your revelry as her sucking becomes more stimulating and intense.");
		//[player is neither lactating or has nipplecunts]
		if(player.biggestLactation() <= 1 && !player.hasFuckableNipples()) outputText("Of course, since you aren't lactating, nothing but your " +  player.nippleDescript(0) + " reaches her lips.  Marble doesn't seem to be put off by this and still gives you a thoroughly enjoyable experience.");
		outputText("<br><br>");
		outputText("After a while, Marble pulls back from your " +  player.nippleDescript(0) + " and tells you, \"<i>Sweetie, I know how annoying it is to only have one of your nipples serviced, so I will be sure to finish the job.</i>\"  She dives right into your ");
		if(player.totalNipples() > 2) outputText("next");
		else outputText("other");
		outputText(" " +  player.nippleDescript(0) + " and starts the experience all over again.  By the end, her efforts have successfully rung an orgasm from you. After cleaning up a bit, Marble sends you off in high spirits.");
	}
	player.orgasm();
}

// Combat Scenes
MarbleScene.victoryAgainstMarble = function() {
	displaySprite("marble");
	clearOutput();
	//Win by hp
	if(monster.HP < 1) outputText("Marble falls to the ground defeated; she looks up at you helplessly, wondering what you're going to do next. ");
	//win by lust
	else outputText("Marble collapses and looks at you longingly, pulling up her skirt with a look of desperation in her eyes. ");
	//after the lust+HP defeat scenes if the player wins
	outputText("You've gathered a bit of a crowd around you now, thanks to the noise of this cow clunking around with her huge hooves and hammer.  It might not be a terribly good idea to rape Marble...  you'd have to drag her up to her room just to avoid interruption and Whitney would likely find out and be upset.  What do you do?");
	
	//Options, rape in room, milk (Spy's submission - not included yet) and, don't rape.
	//var feed = null;
	//if(player.findPerk(PerkLib.Feeder) >= 0 || player.lactationQ() > 200) feed = forceFeedMarble;
	menu();
	//addButton(0, "Feed her", feed);
	addButton(0, "RapeInRoom", MarbleScene.rapeMarbleInHerRoom);
	addButton(1, "Leave", cleanupAfterCombat);
}

MarbleScene.rapeMarbleInHerRoom = function() {
	clearOutput();
	displaySprite("marble");
	outputText("You aren't going to give up on this opportunity, but you don't want to have an audience either.  So you drag Marble and her hammer back to her room, and throw Marble onto her bed, grabbing and twisting her nipples, causing her to cry out in pain and pleasure.");
	outputText("  You suddenly grab at her breasts and squeeze them roughly, at which point she screams and ");
	outputText("tries to slap you.  You easily duck under her hand and start twisting her nipples.  She squeals and begins to go limp under your painful ministrations.  You move her around and force her to kneel, pushing her face down into her bed.  Keeping one of your hands on her nipple, you pull down her skirt and expose her beautiful womanhood and asshole.<br><br>");
	//dicked players
	if(player.cocks.length > 0) {
		outputText("Chuckling to yourself, you free your " + player.multiCockDescriptLight() + " from your " + player.armor.longName + ".  You spend a moment to ask the helpless cow-girl if she is ready, her only response being a whimper, before ", false);
		//If player's main dick is less than 3 inches wide, ie would fit inside Marble
		if(player.cocks[0].cockThickness < 3) {
			//how far in does the player go?
			if(player.cocks[0].cockLength <= 8) {
				outputText("forcing your " + player.cockDescript(0) + " in as far as it will go.  ");
			} else 
			{
				outputText("forcing your " + player.cockDescript(0) + " in to the hilt.  ");
			}
			//the raping proper
			outputText("With a grunt of pleasure, you start to push in and out while simultaneously manhandling her sensitive breasts.  Her pained cries and squeals only make you hornier and the experience all the more enjoyable for you.  You laugh from the pleasure you're getting at the expense of her pain.  Slapping her ass and marvelling at how it jiggles, you quicken the pace of your thrusts inside her.  Marble gasps at the increased rate, alternating between tones of pleasure and pain.<br><br>");
			//is the player corrupt enough to get the fantasy?
			if(player.cor>=33) 
				MarbleScene.marbleRapeCorruptFantasy();
			outputText("You taunt her one more time before feeling your body get racked by an orgasm and you blow your load inside her.  ");
			//set player's lust to 0
			player.orgasm();
		}
		//now if the player doesn't fit
		else {
			outputText("attempting to push your " + player.cockDescript(0)  + " inside her.  Of course, the girth of your " + player.cockDescript(0)  + " makes this a rather difficult operation, and it becomes clear after a few moments that it just isn't going to fit.  Instead, you contend yourself by rubbing yourself between her ample ass cheeks, occasionally stroking your " + player.multiCockDescriptLight() + " in pride.<br><br>");
			//is the player corrupt enough to get the fantasy?
			if(player.cor>=33) 
				MarbleScene.marbleRapeCorruptFantasy();
			outputText("You taunt her one more time before feeling your body get racked by an orgasm and you blow your load onto her ass.  ");
			//set player's lust to 0
			player.orgasm();
		}
	}
	//dickless girls
	else if(player.vaginas.length > 0) {
		outputText("You take a quick look around the room to see if you can find something to make this more enjoyable, and notice a double dildo laying on the end table.  You grab the tool and push it into Marble's womanhood, causing a small gasp of pleasure from her that turns into one of pain as you twist one of her nipples.<br><br>");
		outputText("Keeping Marble in place, you get your " + player.vaginaDescript(0) + " ready to take in the other end of the dildo before doing so with gusto.  Much to Marble's discomfort, you manipulate the dildo in ways to heighten your own pleasure but give Marble a less enjoyable experience.  You ask her if she likes it, to which she responds with a whine and an attempt to move into a more comfortable position.  You tighten your grip on her, and she freezes again.<br><br>");
		//is the player corrupt enough to get the fantasy?
		if(player.cor>=33)
			MarbleScene.marbleRapeCorruptFantasy();
		outputText("You taunt her one more time before feeling your body get racked by a satisfying orgasm from using Marble's own toy against her.  ");
		//set player's lust to 0
		player.orgasm();
	}
	//the genderless option
	else {
		outputText("Your lack of genitals makes it difficult to actually rape Marble, but there are other things you can do.  With your free hand, you push one of your fingers into her womanhood, causing Marble to squeal as you start wriggling it around.  Of course, that's just the beginning, as soon there are two fingers in there, and then three.  As each one goes in, there is another gasp from Marble.  You pinch her nipples as your fourth goes in, pulling out a rather interesting gasp of both pain and pleasure.<br><br>");
		//is the player corrupt enough to get the fantasy?
		if(player.cor >= 33) 
			MarbleScene.marbleRapeCorruptFantasy();
		outputText("With just one more thing to do, you laugh at Marble before shoving your full fist inside her.  The act results in that familiar gasp of pain and pleasure.  Playing with her is indeed quite satisfying.  ");
		//Reduce player lust by 20
		player.modStats("lus", -20);
	}
	//Pass several hours
	//Just before Marble hits the player with her hammer in original rape scene
	outputText("Satisfied, you pull back from the cow-girl's quivering body, and collect her hammer from the floor, informing her that you'll be taking it as compensation for the trouble she's caused you.  After dressing, you exit the barn.");
	if (gameFlags[FARM_CORRUPTION_STARTED] == 0)
	{
		outputText("<br><br>A very angry looking Whitney is staring at you.  \"<i>It seems I misjudged you, [name].  The fuck did you do to Marble?</i>\"  Seems to be a rhetorical question; the knowledge and her reaction to it are already all over her face.  \"<i>Don't you dare ever fucking come back here.  This place is a sanctuary from your kind, and I will kill to protect it.</i>\"  You snort and leave the farm, keeping Marble's hammer.  You didn't like the place anyway.");
	}
	
	gameFlags[FARM_DISABLED] = 1;
	
	//End event
	cleanupAfterCombat(); // Maybe move this
}

MarbleScene.defeatAgainstMarble = function() {
	displaySprite("marble");
	clearOutput();
	//lose by hp
	if(player.HP < 1) outputText("After a few too many blows to the head, you topple over to the ground.  ");
	//lose by lust
	else outputText("Overcome by desire, you fall to your knees, and start masturbating furiously.  Disgusted with you, Marble hits you upside the head once more, knocking you over.  ");
	outputText("She leans in close to your head and whispers \"<i>Don't ever come near me again, or I will crush your head with this hammer.</i>\"  She stands up and walks away from you as you pass out from your head injuries.  ");	
	cleanupAfterCombat();
}

// Marble Creature

function Marble() {
	//Name and references
	this.a = "";
	this.name = "Marble";
	this.refName = this.name;
	this.isAre = "is";
	this.heShe = "she";
	this.himHer = "her";
	this.hisHer = "her";
	this.battleDesc = "Before you stands a female humanoid with numerous cow features, such as medium-sized cow horns, cow ears, and a cow tail.  She is very well endowed, with wide hips and a wide ass.  She stands over 6 feet tall.  She is using a large two handed hammer with practiced ease, making it clear she is much stronger than she may appear to be.";
	
	//Stats
	this.str = 75;
	this.tou = 70;
	this.spe = 35;
	this.inte = 40;
	this.lib = 25;
	this.sens = 45;
	this.cor = 40;
	//Combat stats
	this.HP = this.maxHP();
	this.lust = 0;
	this.fatigue = 0;
	//Advancement
	this.level = 7;
	this.gems = 25 + rand(5);
    //Battle variables
    this.weapon.equipmentName = "large hammer";
    this.weapon.verb = "hammer-blow";
	this.weapon.attack = 10;
    this.armor.equipmentName = "tough hide";
    this.lustVuln = 1; // No idea
	this.temperment = 2; // TEMPERMENT_RANDOM_GRAPPLES

    //Appearance
    this.tallness = 76;
    this.hipRating = HIP_RATING_CURVY;
    this.buttRating = BUTT_RATING_LARGE;
	this.lowerBody = LOWER_BODY_TYPE_HOOFED
    this.skinTone = "pale";
    this.hairColor = "brwon";
    this.hairLength = 13;
	
	//Sexual characteristics
    this.createVagina(false, VAGINA_WETNESS_NORMAL, VAGINA_LOOSENESS_NORMAL);
    this.createBreastRow(Appearance.breastCupInverse("F"));
    this.ass.analLooseness = ANAL_LOOSENESS_VIRGIN;
    this.ass.analWetness = ANAL_WETNESS_DRY;

    //Drops
    this.clearDrops(); //Need to be called before populating the item arrays.
    this.addDrop(Items.Weapons.BeautifulSword, 100); // TODO: CHANGE TO LARGE HAMMER

	//Victory/defeat
	this.victory = MarbleScene.victoryAgainstMarble
	this.defeat = MarbleScene.defeatAgainstMarble
}

Marble.prototype = new Creature();
Marble.prototype.constructor = Marble;

//------------
// COMBAT
//------------

Marble.prototype.doAI = function() {
	switch(rand(4)) {
		case 0:
			Marble.specialAttackOne();
			break;
		case 1:
			Marble.specialAttackTwo();
			break;
		default:
			this.attack();
	}
	combatRoundOver();
}

Marble.specialAttackOne = function() {
	// Special 1: Heavy overhead swing, high chance of being avoided with evasion, does heavy damage if it hits.
	var damage = 0;
	
	// Blind dodge
	if(findStatusEffect(StatusEffects.Blind) >= 0) {
		outputText("Marble unwisely tries to make a massive swing while blinded, which you are easily able to avoid.");
		return;
	}
	// Determine if dodged
	if(player.spe - spe > 0 && int(Math.random() * ((player.spe - spe)/4)+80) > 60) {
		outputText("You manage to roll out of the way of a massive overhand swing.");
		return;
	}
	// Determine if evaded
	if(player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 60) {
		outputText("You easily sidestep as Marble tries to deliver a huge overhand blow.");
		return;
	}
	// Determine damage
	damage = int((str + 20 + weaponAttack) - Math.random()*(player.tou) - player.armorDef);
	if(damage <= 0) {
		damage = 0;
		outputText("You somehow manage to deflect and block Marble's massive overhead swing.");
		return;
	}
	outputText("You are struck by a two-handed overhead swing from the enraged cow-girl.  (" + damage + " damage).");
	player.changeHP(-damage, true);
}

Marble.specialAttackTwo = function() {

	//Special 2: Wide sweep; very high hit chance, does low damage.
	var damage = 0;
	
	// Blind attack
	if(findStatusEffect(StatusEffects.Blind) >= 0) {
		outputText("Marble makes a wide sweeping attack with her hammer, which is difficult to avoid even from a blinded opponent.<br>");
	}
	// Determine if evaded
	if(player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
		outputText("You barely manage to avoid a wide sweeping attack from marble by rolling under it.");
		return;
	}
	// Determine damage
	damage = int(((str + 40 + weaponAttack) - Math.random()*(player.tou) - player.armorDef)/2);
	if(damage <= 0) {
		damage = 0;
		outputText("You easily deflect and block the damage from Marble's wide swing.");
		return;
	}
	outputText("Marble easily hits you with a wide, difficult to avoid swing.  (" + damage + " damage).");
	player.changeHP(-damage, true);
}
