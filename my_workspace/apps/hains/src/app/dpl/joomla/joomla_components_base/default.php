<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');
// Change Default to Component Name
class ReactModelDefault extends JModelLegacy
{
    public function __construct()
    {
        parent::__construct();
        $this->app = JFactory::getApplication();
        $this->params = $this->app->getParams('com_react');
        $this->input = $this->app->input;
        $this->session = JFactory::getSession();
    }
}