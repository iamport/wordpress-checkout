<?php
	ob_start();
?>
	<div class="iamport-modal <?=$device?>" id="iamport-survey-box-<?=$uuid?>" style="display:none">
		<div class="iamport-modal-header">
			<div class="iamport-modal-close"><img src="<?=plugin_dir_url(__FILE__)?>../../assets/img/close-button.png" /></div>
			<div class="main-title"><?=$attr['title']?></div>
			<div class="sub-title"><?=$attr['description']?></div>
		</div>
		<div class="iamport-modal-container">
			<div class="iamport-modal-content">
			</div>
		</div>
		<p class="button-holder" style="text-align:center">
			<a href="#" id="iamport-end-survey-button" class="iamport-modal-button w100">다음</a>
		</p>
	</div>
<?php
	$html_survey_box = ob_get_clean();
	$trim_html_survey_box = preg_replace($regexNewline, '', $html_survey_box);
?>
	<script type="text/javascript">
		jQuery(function($) {
			if ( $('#iamport-survey-box-<?=$uuid?>').length == 0 ) {
				$('body').append('<?=$trim_html_survey_box?>');
			}
		});
	</script>