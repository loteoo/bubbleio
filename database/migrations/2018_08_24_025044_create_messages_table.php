<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->increments('id');
            $table->text('text');
            $table->unsignedInteger('thread_id');
            $table->unsignedInteger('bubble_id');
            $table->softDeletes();
            $table->timestamps();
            
            $table->foreign('thread_id')
                  ->references('id')
                  ->on('threads')
                  ->onDelete('restrict');
                  
            $table->foreign('bubble_id')
                  ->references('id')
                  ->on('bubbles')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
