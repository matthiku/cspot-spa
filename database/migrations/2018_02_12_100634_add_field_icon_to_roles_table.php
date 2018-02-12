<?php
/**
 * AddFieldIconToRolesTable Class Doc Comment
 * PHP version 7
 *
 * @category Class
 * @package  CSPOTSPA
 * @author   Matthias Kuhs <matthiku@yahoo.com>
 * @license  http://www.gnu.org/copyleft/gpl.html GNU General Public License
 * @link     http://cspothome.eec.ie/
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * AddFieldIconToRolesTable Class Doc Comment
 *
 * @category Class
 * @package  CSPOTSPA
 * @author   Matthias Kuhs <matthiku@yahoo.com>
 * @license  http://www.gnu.org/copyleft/gpl.html GNU General Public License
 * @link     http://cspothome.eec.ie/ *
 */
class AddFieldIconToRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'ROLES', function (Blueprint $table) {
                // add material icon name for this role
                $table->text('icon')->nullable();
            }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table(
            'ROLES', function (Blueprint $table) {
                // remove icon field
                $table->dropColumn('icon');
            }
        );
    }
}
