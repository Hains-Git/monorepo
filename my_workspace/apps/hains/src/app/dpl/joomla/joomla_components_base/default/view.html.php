<?php
/**
 * @version   0.1.0
 * @author    Vorname Nachname
 * @copyright Copyright (C) 2015 Vorname Nachname
 * @license   http://www.gnu.org/licenses/gpl-3.0.html
 */
// Change Default to Component Name
defined('_JEXEC') or die;
require_once JPATH_COMPONENT . '/views/BasicView.php';

class ReactViewDefault extends BasicView
{
	public function display($tpl = null)
	{
		parent::display($tpl);
	}
}