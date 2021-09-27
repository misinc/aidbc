<ul id="hybridSubmenu">
	<li{% if active == "Backups" %} class="active"{% endif %}><a href="index.html">Backups</a></li>
	<li{% if active == "Settings" %} class="active"{% endif %}><a href="settings.html">Settings</a></li>
	<li{% if active == "Instructions" %} class="active"{% endif %}><a href="instructions.html">Instructions</a></li>
</ul>
{% if active != "" %}
	<div id="info">
		<button id="upgradeBtn" class="show-lite show-beta hide basic-button large-button" data-remodal-target="upgrade">Upgrade</button>
		<a href="about.html"><i class="fa fa-info-circle"></i></a>
	</div>
{% endif %}
<div class="remodal" data-remodal-id="upgrade">
	<div class="modal-header">
		<h4>Upgrade Automatic Backups</h4>
	</div>
	<div class="modal-body">
		<p>You're using the Lite version of Automatic Backups, which only backs up Files. To backup more of your website, ask your Developer to upgrade to the Full version of Automatic Backups. See the Instructions tab for a complete list of everything you can back up with the Full version of Automatic Backups.</p>
	</div>
	<div class="modal-footer">
		<a class="basic-button large-button" data-remodal-action="close">Close</a>
	</div>
</div>
