<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateThreadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('threads', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->increments('id');
            $table->string('title');
            $table->text('text');
            $table->string('link');
            $table->string('image');
            $table->integer('votes');
            $table->enum('type', ['default', 'text', 'link', 'image']);
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('bubble_id');
            
            $table->softDeletes();
            $table->timestamps();
            
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
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
        Schema::dropIfExists('threads');
    }
}
